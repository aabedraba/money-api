"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

const LoadingAnimation = () => (
  <div className="grid grid-cols-3 gap-4">
    <div className="h-2 bg-slate-200 rounded col-span-2"></div>
    <div className="h-2 bg-slate-200 rounded col-span-1"></div>
  </div>
)

type StripeActiveSubscription = {
  product: {
    name: string
    metadata: {
      requestLimit: number
    }
  }
  usage: {
    total_usage: number
  }
}

export const CurrentSubscription = () => {
  const [loading, setLoading] = useState(true)
  const [customerSubscription, setCustomerSubscription] =
    useState<StripeActiveSubscription | null>(null)

  useEffect(() => {
    const findStripeCustomer = async () => {
      const response = await fetch("/api/stripe/subscription", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const customerSubscription = await response.json()

      if (response.ok) {
        setCustomerSubscription(customerSubscription)
      }

      setLoading(false)
    }

    findStripeCustomer()
  }, [])

  return (
    <>
      {loading ? (
        <LoadingAnimation />
      ) : (
        <div className="flex flex-col w-full items-center justify-center">
          <p>
            You are currently subscribed to{" "}
            <b>{customerSubscription?.product.name}</b> plan
          </p>
          {customerSubscription?.usage ? (
            <p>
              You have made <b>{customerSubscription?.usage.total_usage}</b>{" "}
              requests this month
            </p>
          ) : (
            <p>
              You have{" "}
              <b>{customerSubscription?.product.metadata.requestLimit}</b>{" "}
              requests/month
            </p>
          )}
          <p>
            Manage your subscription{" "}
            <Link
              className="text-blue-600 hover:underline"
              href={process.env.NEXT_PUBLIC_STRIPE_PORTAL_URL || ""}
            >
              here.
            </Link>
          </p>
        </div>
      )}
    </>
  )
}
