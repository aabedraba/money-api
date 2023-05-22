import { DefaultSession } from "next-auth"

export const createZuploConsumerFromSession = async (
  session: DefaultSession
) => {
  const body = {
    description: `bucket for ${session.user!.email}`,
    metadata: {
      email: session.user!.email,
    },
    managers: session.user!.email,
    name:
      (session.user?.name
        ? session.user.name.replace(/\s/g, "-").toLowerCase()
        : session.user!.email?.replace(/@.*/, "")) + "-bucket",
    tags: {
      account: process.env.ZUPLO_ACCOUNT_ID,
      environmentType: "PRODUCTION",
      project: process.env.ZUPLO_PROJECT_ID,
    },
  }

  const createConsumerResult = await fetch(
    `https://dev.zuplo.com/v1/accounts/${process.env.ZUPLO_ACCOUNT_ID}/key-buckets/${process.env.ZUPLO_KEY_BUCKET}/consumers`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ZUPLO_API_KEY}`,
      },
      body: JSON.stringify(body),
    }
  )

  if (!createConsumerResult.ok) {
    throw new Error(
      `Failed to create consumer in Zuplo. Status: ${createConsumerResult.status}`
    )
  }

  const createConsumerResultJson = await createConsumerResult.json()

  return createConsumerResultJson
}
