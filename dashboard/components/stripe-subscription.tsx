"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import FullScreenLoading from "./full-screen-loading"

export const StripeSubscription = () => {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const findStripeCustomer = async () => {
      const response = await fetch("/api/stripe/customer", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        router.push("/dashboard")
      }

      setLoading(false)
    }

    findStripeCustomer()
  }, [])

  if (loading) return <FullScreenLoading />

  return (
    <>
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
            Subscribe to our API and start
            <br className="hidden sm:inline" />
            now the change of your life.
          </h1>
          <p className="text-muted-foreground max-w-[700px] text-lg  sm:text-xl">
            The fastest way to get what you need.
          </p>
        </div>
      </section>
      <div
        dangerouslySetInnerHTML={{
          __html: `
              <stripe-pricing-table 
                pricing-table-id="prctbl_1N9w5eG5nE8RSfGyiSiEgIwj"
                publishable-key="pk_test_51HWUYJG5nE8RSfGywgJ3pwfcC9m4Hiic2QejxjU3mehsrUHBIzmLlZuMJGHeZ7JfKjN5Kmxn5d1FnsOB9tFUejeV00f5HIW9Bk">
              </stripe-pricing-table>
            `,
        }}
      />
    </>
  )
}
