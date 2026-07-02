import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { connect } from "framer-api"

function loadHomeEnv() {
  const envPath = path.join(os.homedir(), ".env")

  if (!fs.existsSync(envPath)) {
    return
  }

  const contents = fs.readFileSync(envPath, "utf8")

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim()

    if (!line || line.startsWith("#")) {
      continue
    }

    const equalsIndex = line.indexOf("=")

    if (equalsIndex === -1) {
      continue
    }

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

function getProjectTarget() {
  const projectUrl = process.env.FRAMER_PROJECT_URL
  const projectId = process.env.FRAMER_PROJECT_ID

  if (projectUrl) {
    return projectUrl
  }

  if (projectId) {
    return projectId.startsWith("https://")
      ? projectId
      : `https://framer.com/projects/${projectId}`
  }

  throw new Error(
    "Missing FRAMER_PROJECT_URL or FRAMER_PROJECT_ID in ~/.env. Use a value like https://framer.com/projects/<id>."
  )
}

loadHomeEnv()

const apiKey = process.env.FRAMER_API_KEY ?? process.env.FRAMER_API_TOKEN

if (!apiKey) {
  throw new Error(
    "Missing FRAMER_API_KEY or FRAMER_API_TOKEN in ~/.env. Do not paste it into chat."
  )
}

const projectTarget = getProjectTarget()
const framer = await connect(projectTarget, apiKey)

try {
  const projectInfo = await framer.getProjectInfo()
  const changedPaths = await framer.getChangedPaths()

  console.log("Framer API auth: OK")
  console.log(`Project: ${projectInfo.name}`)
  console.log(
    `Changed paths: added=${changedPaths.added.length}, modified=${changedPaths.modified.length}, removed=${changedPaths.removed.length}`
  )
} finally {
  await framer.disconnect()
}
