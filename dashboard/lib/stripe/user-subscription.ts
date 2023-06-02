const stripeAPIKey = process.env.STRIPE_SECRET_KEY

const stripeRequest = async (path: string) => {
  const request = await fetch("https://api.stripe.com" + path, {
    headers: {
      Authorization: `Bearer ${stripeAPIKey}`,
    },
  })

  return await request.json()
}

type StripeCustomer = {
  id: string
}

export async function getStripeCustomer(email: string) {
  try {
    const customerSearchResult = await stripeRequest(
      `/v1/customers?email=${email}`
    )

    if (customerSearchResult.data.length === 0) {
      console.warn("User not found in Stripe", email)
      return null
    }

    return customerSearchResult.data[0] as StripeCustomer
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function getCustomerSubscription(stripeCustomerId: string) {
  const supbscriptionPlan = await stripeRequest(
    "/v1/subscriptions?customer=" + stripeCustomerId + "&status=active&limit=1"
  )

  if (supbscriptionPlan.data.length === 0) {
    return null
  }

  return supbscriptionPlan.data[0]
}

export async function getSubscriptionItemUsage(subscriptionItemId: string) {
  const subscriptionItemUsageRecords = await stripeRequest(
    "/v1/subscription_items/" + subscriptionItemId + "/usage_record_summaries"
  )

  if (subscriptionItemUsageRecords.data.length === 0) {
    return null
  }

  return subscriptionItemUsageRecords.data[0]
}

export async function getProductById(productId: string) {
  return await stripeRequest("/v1/products/" + productId)
}
