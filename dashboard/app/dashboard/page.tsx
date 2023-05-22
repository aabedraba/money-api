export default async function DashboardPage() {
  const zuploUrl = process.env.ZUPLO_URL

  return (
    // center the content
    <div className="flex items-center justify-center">
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="text-center items-center">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl pb-8">
            To use the API follow the instructions below.
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
            Go to ${zuploUrl}/docs and sign in
          </p>
          <img src="/docs-signin.png" alt="docs" />
          <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
            Once logged in, click on <code>Create Key</code>
          </p>
          <img src="/bucket-create-key.png" alt="create key" />
          <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
            Make an authenticated API request
          </p>
          <code>curl</code>
        </div>
      </section>
    </div>
  )
}
