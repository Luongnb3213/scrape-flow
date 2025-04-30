import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return <SignUp signInForceRedirectUrl={"https://scrape-flow-two-sand.vercel.app/setup"} />
}