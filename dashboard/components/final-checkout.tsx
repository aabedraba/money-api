"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import FullScreenError from "./full-screen-error"
import FullScreenLoading from "./full-screen-loading"

export default function FinishCheckout() {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const createConsumerInZuplo = async () => {
      const fetchResult = await fetch("/api/zuplo/consumer", {
        method: "POST",
      })

      const json = await fetchResult.json()

      if (!fetchResult.ok) {
        setErrorMessage(
          json.error || `Unknown error... Status: ${fetchResult.status}}`
        )
        return
      }

      return router.push("/dashboard")
    }

    createConsumerInZuplo()
  }, [])

  return (
    <>
      {errorMessage ? (
        <FullScreenError message={errorMessage} />
      ) : (
        <FullScreenLoading />
      )}
    </>
  )
}
