"use client"

import Link from "next/link"
import { Session } from "next-auth"

import { siteConfig } from "@/config/site"

import { useSignInModal } from "./sign-in-modal"
import UserDropdown from "./user-dropdown"

interface NavBarProps {
  session: Session | null
}

export default function NavBar({ session }: NavBarProps) {
  const { SignInModal, setShowSignInModal } = useSignInModal()

  return (
    <div className="flex gap-6 md:gap-10">
      <SignInModal />
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <div>{session ? <UserDropdown session={session} /> : <></>}</div>
    </div>
  )
}
