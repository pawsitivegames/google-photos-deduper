import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { connect } from "framer-api"

function loadHomeEnv() {
  const envPath = path.join(os.homedir(), ".env")

  if (!fs.existsSync(envPath)) return

  for (const rawLine of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith("#")) continue

    const equalsIndex = line.indexOf("=")
    if (equalsIndex === -1) continue

    const key = line.slice(0, equalsIndex).trim()
    let value = line.slice(equalsIndex + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    process.env[key] ??= value
  }
}

loadHomeEnv()

const apiKey = process.env.FRAMER_API_KEY ?? process.env.FRAMER_API_TOKEN
const projectUrl = process.env.FRAMER_PROJECT_URL ?? process.env.FRAMER_PROJECT_ID

if (!apiKey) throw new Error("Missing FRAMER_API_KEY or FRAMER_API_TOKEN in ~/.env")
if (!projectUrl) throw new Error("Missing FRAMER_PROJECT_URL or FRAMER_PROJECT_ID in ~/.env")

const framer = await connect(projectUrl, apiKey)

try {
  const info = await framer.getProjectInfo()
  const branch = await framer.agent.getActiveBranch().catch((error) => ({
    error: error.message,
  }))
  const context = await framer.agent.getContext({ pagePath: "/" }).catch((error) => ({
    error: error.message,
  }))
  const changes = await framer.getChangedPaths()

  console.log(JSON.stringify({ info, branch, changes, context }, null, 2))
} finally {
  await framer.disconnect()
}
