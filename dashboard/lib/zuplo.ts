import { DefaultSession, ISODateString } from "next-auth"

const zuploDevApiBaseUrl = "https://dev.zuplo.com/v1"

const zuploRequest = async (path: string, method: string, body?: any) => {
  const request = await fetch(`${zuploDevApiBaseUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.ZUPLO_API_KEY}`,
    },
    body: body && JSON.stringify(body),
  })

  return request
}

export interface LoggedInSession extends Partial<DefaultSession> {
  user: {
    name: string
    email: string
    image: string
  }
  expires: ISODateString
}

export const createZuploConsumerFromSession = async (
  session: LoggedInSession,
  metadata: { stripeCustomerId: string }
) => {
  const consumerName =
    (session.user.name
      ? session.user.name.replace(/\s/g, "-").toLowerCase()
      : session.user.email.replace(/@.*/, "")) + "-bucket"

  const body = {
    description: `bucket for ${session.user.email}`,
    metadata: {
      stripeCustomerId: metadata.stripeCustomerId,
    },
    managers: session.user.email,
    name: consumerName,
    tags: {
      account: process.env.ZUPLO_ACCOUNT_ID,
      environmentType: "PRODUCTION",
      project: process.env.ZUPLO_PROJECT_ID,
    },
  }

  // Check if consumer already exists
  const existingConsumer = await zuploRequest(
    `/accounts/${process.env.ZUPLO_ACCOUNT_ID}/key-buckets/${process.env.ZUPLO_KEY_BUCKET}/consumers/${consumerName}`,
    "GET"
  )

  const existingConsumerJson = await existingConsumer.json()

  if (existingConsumerJson.id) {
    return existingConsumerJson
  }

  // Create Zuplo Consumer
  const createConsumerResult = await zuploRequest(
    `/accounts/${process.env.ZUPLO_ACCOUNT_ID}/key-buckets/${process.env.ZUPLO_KEY_BUCKET}/consumers`,
    "POST",
    body
  )

  const createConsumerResultJson = await createConsumerResult.json()

  if (!createConsumerResult.ok) {
    console.error(
      `Failed to create consumer in Zuplo. Status: ${JSON.stringify(
        createConsumerResultJson
      )}`
    )
    return null
  }

  return createConsumerResultJson
}
