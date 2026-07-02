#!/usr/bin/env node

const STRIPE_API_BASE = "https://api.stripe.com/v1"
const STRIPE_API_VERSION = "2026-02-25.clover"

const products = [
  {
    planId: "mini_cleanup",
    envVar: "PHOTOSWEEP_STRIPE_PRICE_MINI_CLEANUP",
    productName: "PhotoSweep Mini Cleanup",
    priceNickname: "Mini Cleanup",
    unitAmount: 299
  },
  {
    planId: "cleanup_pass",
    envVar: "PHOTOSWEEP_STRIPE_PRICE_CLEANUP_PASS_7D",
    productName: "PhotoSweep Cleanup Pass",
    priceNickname: "Cleanup Pass 7 days",
    unitAmount: 499
  },
  {
    planId: "lifetime",
    envVar: "PHOTOSWEEP_STRIPE_PRICE_LIFETIME_EARLY_ACCESS",
    productName: "PhotoSweep Lifetime Early Access",
    priceNickname: "Lifetime Early Access",
    unitAmount: 1499
  }
]

function requiredEnv(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing ${name}. Set it to your Stripe secret key.`)
  }
  return value
}

async function stripeRequest(path, params, idempotencyKey) {
  const response = await fetch(`${STRIPE_API_BASE}${path}`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${requiredEnv("STRIPE_SECRET_KEY")}`,
      "content-type": "application/x-www-form-urlencoded",
      "stripe-version": STRIPE_API_VERSION,
      "idempotency-key": idempotencyKey
    },
    body: new URLSearchParams(params)
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(`${path} failed: ${JSON.stringify(body)}`)
  }
  return body
}

async function createProduct(config) {
  return stripeRequest(
    "/products",
    {
      name: config.productName,
      "metadata[app]": "photosweep",
      "metadata[planId]": config.planId
    },
    `photosweep-product-${config.planId}`
  )
}

async function createPrice(config, productId) {
  return stripeRequest(
    "/prices",
    {
      product: productId,
      currency: "usd",
      unit_amount: String(config.unitAmount),
      nickname: config.priceNickname,
      "metadata[app]": "photosweep",
      "metadata[planId]": config.planId
    },
    `photosweep-price-${config.planId}-${config.unitAmount}-usd`
  )
}

async function main() {
  const outputs = []
  for (const config of products) {
    const product = await createProduct(config)
    const price = await createPrice(config, product.id)
    outputs.push({
      planId: config.planId,
      productId: product.id,
      priceId: price.id,
      envVar: config.envVar
    })
  }

  console.log("Stripe products/prices ready.")
  console.log("")
  for (const output of outputs) {
    console.log(`${output.envVar}=${output.priceId}`)
  }
  console.log("")
  console.log("Product IDs:")
  for (const output of outputs) {
    console.log(`${output.planId}: ${output.productId}`)
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})

