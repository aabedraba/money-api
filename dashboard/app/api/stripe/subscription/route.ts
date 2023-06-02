import { getServerSession } from "next-auth"

import { ErrorResponse, JsonResponse } from "@/lib/response"
import {
  getCustomerSubscription,
  getProductById,
  getStripeCustomer,
  getSubscriptionItemUsage,
} from "@/lib/stripe/user-subscription"

import { authOptions } from "../../auth/[...nextauth]/route"

const handler = async () => {
  const session = await getServerSession(authOptions)

  if (session === null || !session.user || !session.user.email) {
    return new ErrorResponse(
      "You must be signed in to create a Zuplo consumer",
      401
    )
  }

  const stripeCustomer = await getStripeCustomer(session.user.email)

  if (stripeCustomer === null) {
    return new ErrorResponse("You are not a paying customer... yet?", 401)
  }

  const customerSubscription = await getCustomerSubscription(stripeCustomer.id)

  if (customerSubscription === null) {
    return new ErrorResponse("You don't have a subscription in Stripe", 401)
  }

  const product = await getProductById(customerSubscription.plan.product)

  if (!product) {
    return new ErrorResponse("You don't have a product in Stripe", 401)
  }

  if (customerSubscription.plan.usage_type === "metered") {
    const subscriptionItemId = customerSubscription.items.data[0].id

    const subscriptionItemUsage = await getSubscriptionItemUsage(
      subscriptionItemId
    )

    if (subscriptionItemUsage === null) {
      return new ErrorResponse(
        "You don't have any usage for your subscription in Stripe",
        401
      )
    }

    return new JsonResponse({
      usage: subscriptionItemUsage,
      product,
    })
  }

  return new JsonResponse({
    product,
  })
}

export { handler as GET }
