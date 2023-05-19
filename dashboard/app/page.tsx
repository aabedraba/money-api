
import { Button } from "@/components/ui/button"
import {
  Card, CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Subscribe to our API and start<br className="hidden sm:inline" />
          now the change of your life.
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          The fastest way to get what you need.
        </p>
      </div>
      <div className="flex gap-4">
        <Card className="w-[380px]">
          <CardHeader>
            <CardTitle>Business</CardTitle>
            <CardDescription>49$/mo</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button>Subscribe</Button>
          </CardFooter>
        </Card>
        <Card className="w-[380px]">
          <CardHeader>
            <CardTitle>Business</CardTitle>
            <CardDescription>49$/mo</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button>Subscribe</Button>
          </CardFooter>
        </Card>
        <Card className="w-[380px]">
          <CardHeader>
            <CardTitle>Business</CardTitle>
            <CardDescription>49$/mo</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button>Subscribe</Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}
