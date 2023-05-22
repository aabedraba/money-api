const stripeAPIKey = process.env.STRIPE_SECRET_KEY

const stripeRequest = async (path: string) => {
  const request = await fetch("https://api.stripe.com" + path, {
    headers: {
      Authorization: `Bearer ${stripeAPIKey}`,
    },
  })

  return await request.json()
}

export async function getProductSubscriptionFromUser(email: string) {
  let stripeCustomer: any
  try {
    const customerSearchResult = await stripeRequest(
      `/v1/customers?email=${email}`
    )

    if (customerSearchResult.data.length === 0) {
      console.log("User not found in Stripe", email)
      return null
    }

    stripeCustomer = customerSearchResult.data[0]
  } catch (err) {
    console.log(err)
    return null
  }

  const supbscriptionPlan = await stripeRequest(
    "/v1/subscriptions?customer=" + stripeCustomer.id + "&status=active&limit=1"
  )

  if (supbscriptionPlan.data.length === 0) {
    console.log("no subscription plan")
    return null
  }

  const subscription = supbscriptionPlan.data[0]

  const product = await stripeRequest(
    "/v1/products/" + subscription.plan.product
  )

  return product
}
