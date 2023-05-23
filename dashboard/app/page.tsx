import Script from "next/script"
import { getServerSession } from "next-auth"

import { SignInPage } from "@/components/sign-in-page"
import { StripeSubscription } from "@/components/stripe-subscription"

import { authOptions } from "./api/auth/[...nextauth]/route"

export default async function IndexPage() {
  const session = await getServerSession(authOptions)

  return (
    <>
      <Script src="https://js.stripe.com/v3/pricing-table.js" />

      {session?.user ? <StripeSubscription /> : <SignInPage />}
    </>
  )
}
