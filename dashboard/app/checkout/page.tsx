import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { isLoggedInSession } from "@/lib/logged-in"
import { getStripeCustomer } from "@/lib/stripe/user-subscription"
import { createZuploConsumerFromSession } from "@/lib/zuplo"
import FullScreenError from "@/components/full-screen-error"

import { authOptions } from "../api/auth/[...nextauth]/route"

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions)
  const isLoggedIn = isLoggedInSession(session)

  if (!isLoggedIn) {
    return redirect("/")
  }

  const stripeCustomer = await getStripeCustomer(session.user.email)

  if (stripeCustomer === null) {
    return redirect("/")
  }

  const createdZuploConsumer = await createZuploConsumerFromSession(session, {
    stripeCustomerId: stripeCustomer.id,
  })

  if (createdZuploConsumer.err) {
    return <FullScreenError message={createdZuploConsumer.val} />
  }

  return redirect("/dashboard")
}
