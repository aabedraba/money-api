"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function FinishCheckout() {
  const router = useRouter()

  useEffect(() => {
    const createConsumerInZuplo = async () => {
      const result = await fetch("/api/create-zuplo-consumer")

      if (result.status !== 200) {
        return router.push("/checkout-error")
      }

      const data = await result.json()

      if (data.error) {
        console.log(data.error)
        return router.push("/checkout-error")
      }

      return router.push("/dashboard")
    }

    createConsumerInZuplo()
  }, [router])

  return (
    <div>
      <h1>Finishing Checkout....</h1>
    </div>
  )
}
