import { redirect } from "next/navigation"
import Script from "next/script"
import { getServerSession } from "next-auth"

import { getStripeSubscriptionByEmail } from "@/lib/stripe/user-subscription"
import { SignInPage } from "@/components/sign-in-page"
import { StripeSubscriptionTable } from "@/components/stripe-subscription"

import { authOptions } from "./api/auth/[...nextauth]/route"

export default async function IndexPage() {
  const session = await getServerSession(authOptions)
  if (session?.user?.email) {
    const subscriptionResult = await getStripeSubscriptionByEmail(
      session.user.email
    )
    if (subscriptionResult.ok) {
      redirect("/dashboard")
    }
  }

  return (
    <>
      <Script src="https://js.stripe.com/v3/pricing-table.js" />

      {session?.user ? <StripeSubscriptionTable /> : <SignInPage />}
    </>
  )
}
