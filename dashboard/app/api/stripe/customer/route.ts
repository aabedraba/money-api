import { getServerSession } from "next-auth"

import { ErrorResponse } from "@/lib/response"
import { getProductSubscriptionFromUser } from "@/lib/stripe/user-subscription"

import { authOptions } from "../../auth/[...nextauth]/route"

const handler = async () => {
  const session = await getServerSession(authOptions)

  if (session === null || !session.user || !session.user.email) {
    return new ErrorResponse(
      "You must be signed in to create a Zuplo consumer",
      401
    )
  }

  const customerSubscribedProduct = await getProductSubscriptionFromUser(
    session.user.email
  )

  if (customerSubscribedProduct === null) {
    return new ErrorResponse("You don't have a subscription in Stripe", 401)
  }

  return new Response(
    JSON.stringify({
      ...customerSubscribedProduct,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
}

export { handler as GET }
