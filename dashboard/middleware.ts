export { default } from "next-auth/middleware"

export const config = {
  matcher: ["/dashboard", "/checkout", "/api/create-zuplo-consumer"],
}
