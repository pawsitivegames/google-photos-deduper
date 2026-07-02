import http from "node:http"

import { afterEach, describe, expect, it } from "vitest"

import { createMemoryLicenseStore } from "../../server/license-api.mjs"
import {
  createNodeRequestHandler,
  createWebhookRecoveryEmailSender
} from "../../server/node-server.mjs"

const servers: http.Server[] = []

afterEach(async () => {
  await Promise.all(
    servers.map(
      (server) =>
        new Promise<void>((resolve, reject) => {
          server.close((error) => (error ? reject(error) : resolve()))
        })
    )
  )
  servers.length = 0
})

function listen(server: http.Server): Promise<number> {
  return new Promise((resolve, reject) => {
    server.once("error", reject)
    server.listen(0, "127.0.0.1", () => {
      const address = server.address()
      if (!address || typeof address === "string") {
        reject(new Error("Server did not expose a TCP address."))
        return
      }
      resolve(address.port)
    })
  })
}

function request(
  port: number,
  body: string,
  path = "/checkout"
): Promise<{ status: number; headers: http.IncomingHttpHeaders; body: string }> {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        host: "127.0.0.1",
        port,
        path,
        method: "POST",
        headers: {
          "content-type": "application/json",
          "content-length": Buffer.byteLength(body)
        }
      },
      (res) => {
        const chunks: Buffer[] = []
        res.on("data", (chunk) => chunks.push(Buffer.from(chunk)))
        res.on("end", () => {
          resolve({
            status: res.statusCode ?? 0,
            headers: res.headers,
            body: Buffer.concat(chunks).toString("utf8")
          })
        })
      }
    )
    req.once("error", reject)
    req.end(body)
  })
}

describe("node license server adapter", () => {
  it("forwards node HTTP requests to the Web Request API handler", async () => {
    const observed: Array<{ method: string; url: string; body: string | null }> = []
    const server = http.createServer(
      createNodeRequestHandler({
        env: {
          NODE_ENV: "development",
          PHOTOSWEEP_COOKIE_SECURE: "0"
        },
        api: async (request: Request) => {
          observed.push({
            method: request.method,
            url: request.url,
            body: await request.text()
          })
          return new Response(JSON.stringify({ ok: true }), {
            status: 201,
            headers: { "content-type": "application/json", "x-license-test": "ok" }
          })
        }
      })
    )
    servers.push(server)
    const port = await listen(server)
    const requestBody = JSON.stringify({ planId: "mini_cleanup" })

    const response = await request(port, requestBody)

    expect(response.status).toBe(201)
    expect(response.headers["x-license-test"]).toBe("ok")
    expect(JSON.parse(response.body)).toEqual({ ok: true })
    expect(observed).toEqual([
      {
        method: "POST",
        url: `http://127.0.0.1:${port}/checkout`,
        body: requestBody
      }
    ])
  })

  it("sends recovery email webhook payloads with optional bearer auth", async () => {
    const calls: Array<{
      url: string
      method: string
      authorization: string | null
      body: unknown
    }> = []
    const sender = createWebhookRecoveryEmailSender({
      env: {
        NODE_ENV: "development",
        PHOTOSWEEP_RECOVERY_EMAIL_WEBHOOK_URL: "https://mail.test/recovery",
        PHOTOSWEEP_RECOVERY_EMAIL_WEBHOOK_SECRET: "mail_secret"
      },
      fetchImpl: async (url: string, init: RequestInit) => {
        calls.push({
          url,
          method: init.method ?? "GET",
          authorization: new Headers(init.headers).get("authorization"),
          body: JSON.parse(String(init.body))
        })
        return new Response(JSON.stringify({ ok: true }), {
          headers: { "content-type": "application/json" }
        })
      }
    })

    await sender?.({
      email: "buyer@example.com",
      recoveryUrl: "https://license.test/license/recover/complete?token=abc"
    })

    expect(calls).toEqual([
      {
        url: "https://mail.test/recovery",
        method: "POST",
        authorization: "Bearer mail_secret",
        body: {
          type: "license_recovery",
          email: "buyer@example.com",
          recoveryUrl: "https://license.test/license/recover/complete?token=abc"
        }
      }
    ])
  })

  it("wires the recovery email webhook into the default license API", async () => {
    const store = createMemoryLicenseStore()
    await store.upsertLicense({
      sessionId: "pls_recover_webhook",
      planId: "cleanup_pass",
      status: "active",
      email: "buyer@example.com",
      purchasedAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
    })
    const webhookCalls: unknown[] = []
    const server = http.createServer(
      createNodeRequestHandler({
        env: {
          NODE_ENV: "development",
          PHOTOSWEEP_COOKIE_SECURE: "0",
          PHOTOSWEEP_RECOVERY_SECRET: "recovery_secret",
          PHOTOSWEEP_RECOVERY_BASE_URL: "https://license.test",
          PHOTOSWEEP_RECOVERY_EMAIL_WEBHOOK_URL: "https://mail.test/recovery"
        },
        store,
        fetchImpl: async (_url: string, init: RequestInit) => {
          webhookCalls.push(JSON.parse(String(init.body)))
          return new Response(JSON.stringify({ ok: true }), {
            headers: { "content-type": "application/json" }
          })
        }
      })
    )
    servers.push(server)
    const port = await listen(server)

    const response = await request(
      port,
      JSON.stringify({ email: "buyer@example.com" }),
      "/license/recover"
    )

    expect(response.status).toBe(200)
    expect(JSON.parse(response.body)).toEqual({ ok: true })
    expect(webhookCalls).toHaveLength(1)
    expect(webhookCalls[0]).toMatchObject({
      type: "license_recovery",
      email: "buyer@example.com"
    })
    expect(JSON.stringify(webhookCalls[0])).toContain(
      "https://license.test/license/recover/complete?token="
    )
  })
})
