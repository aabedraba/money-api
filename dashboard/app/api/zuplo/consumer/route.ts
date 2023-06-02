import { getServerSession } from "next-auth"

import { ErrorResponse } from "@/lib/response"
import {
  getCustomerSubscription,
  getProductById,
  getStripeCustomer,
} from "@/lib/stripe/user-subscription"
import { LoggedInSession, createZuploConsumerFromSession } from "@/lib/zuplo"

import { authOptions } from "../../auth/[...nextauth]/route"

const handler = async () => {
  const session = await getServerSession(authOptions)

  if (
    session === null ||
    !session.user ||
    !session.user.email ||
    !session.user.name
  ) {
    return new ErrorResponse(
      "You must be signed in to create a Zuplo consumer",
      401
    )
  }

  const stripeCustomer = await getStripeCustomer(session.user.email)

  if (stripeCustomer === null) {
    return new ErrorResponse("You must have an active subscription", 401)
  }

  const subscription = await getCustomerSubscription(stripeCustomer.id)

  if (subscription === null) {
    return new ErrorResponse("You must have an active subscription", 401)
  }

  const subscriptionType: "metered" | "monthly-limited" =
    subscription.plan.usage_type === "metered" ? "metered" : "monthly-limited"

  let monthlyRequestLimit: string | undefined = undefined
  if (subscriptionType === "monthly-limited") {
    const product = await getProductById(subscription.plan.product)
    monthlyRequestLimit = product.metadata.monthlyRequestLimit
  }

  const createdZuploConsumer = await createZuploConsumerFromSession(
    session as LoggedInSession, // hacky...
    {
      stripeCustomerId: stripeCustomer.id,
      monthlyRequestLimit: monthlyRequestLimit,
    }
  )

  if (createdZuploConsumer === null) {
    return new ErrorResponse("Failed to create Zuplo consumer", 500)
  }

  return new Response(
    JSON.stringify({
      zuploConsumer: createdZuploConsumer,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
}

export { handler as POST }
