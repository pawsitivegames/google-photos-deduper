import { readFileSync } from "node:fs"
import path from "node:path"

import { describe, expect, it } from "vitest"

const rootDir = path.resolve(__dirname, "../..")

describe("Stripe product setup script", () => {
  it("defines the launch plans, prices, env vars, and Stripe API version", () => {
    const script = readFileSync(
      path.join(rootDir, "tools/setup-stripe-products.mjs"),
      "utf8"
    )

    expect(script).toContain('STRIPE_API_VERSION = "2026-02-25.clover"')
    expect(script).toContain('planId: "mini_cleanup"')
    expect(script).toContain('envVar: "PHOTOSWEEP_STRIPE_PRICE_MINI_CLEANUP"')
    expect(script).toContain("unitAmount: 299")
    expect(script).toContain('planId: "cleanup_pass"')
    expect(script).toContain('envVar: "PHOTOSWEEP_STRIPE_PRICE_CLEANUP_PASS_7D"')
    expect(script).toContain("unitAmount: 499")
    expect(script).toContain('planId: "lifetime"')
    expect(script).toContain(
      'envVar: "PHOTOSWEEP_STRIPE_PRICE_LIFETIME_EARLY_ACCESS"'
    )
    expect(script).toContain("unitAmount: 1499")
    expect(script).toContain("idempotency-key")
  })
})

