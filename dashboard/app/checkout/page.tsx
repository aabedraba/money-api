import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { getProductSubscriptionFromUser } from "@/lib/stripe/user-subscription"
import { createZuploConsumerFromSession } from "@/lib/zuplo"

import { authOptions } from "../api/auth/[...nextauth]/route"

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.user.email) {
    return redirect("/")
  }

  const productExists = await getProductSubscriptionFromUser(session.user.email)

  if (productExists === null) {
    return redirect("/error")
  }

  const createdZuploConsumer = await createZuploConsumerFromSession(session)

  if (!createdZuploConsumer) {
    return redirect("/error")
  }

  return redirect("/dashboard")
}
