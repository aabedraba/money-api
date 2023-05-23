import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"

import { ErrorResponse } from "@/lib/response"
import { getProductSubscriptionFromUser } from "@/lib/stripe/user-subscription"
import { createZuploConsumerFromSession } from "@/lib/zuplo"

import { authOptions } from "../auth/[...nextauth]/route"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(authOptions)

  if (session === null || !session.user || !session.user.email) {
    return new ErrorResponse(
      "You must be signed in to create a Zuplo consumer",
      401
    )
  }

  const productExists = await getProductSubscriptionFromUser(session.user.email)

  if (productExists === null) {
    return new ErrorResponse(
      "You must have a subscription to create a Zuplo consumer",
      401
    )
  }

  const createdZuploConsumer = await createZuploConsumerFromSession(session)

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

export { handler as GET }
