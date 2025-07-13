"use client";

import React from "react";
import AuthModal from "../auth-modal";
import Image from "next/image";
import Link from "next/link";
import { createAuthClient } from "better-auth/react";
import { Loader2 } from "lucide-react";
export const { useSession, signIn, signOut } = createAuthClient();

const navTags = [
  { name: "SANKA", href: "/" },
  { name: "ABOUT", href: "/about" },
  { name: "PRIVACY POLICY", href: "/privacy-policy" },
  { name: "HOW TO USE", href: "/how-to-use" },
];

export default function Navbar() {
  const { data: session, isPending } = useSession();

  return (
    <div className="mx-auto w-full px-4 lg:px-6 xl:max-w-7xl fixed top-0">
      <nav className="flex items-center justify-between gap-4 py-4 lg:h-20 text-sm">
        <div className="flex gap-9 items-center">
          <Link href={"/"}>
            <Image src="/logo-w.svg" alt="Logo" height={40} width={40} />
          </Link>
          {navTags.map((e) => (
            <Link key={e.name} href={e.href}>
              <p className="text-neutral-500">{e.name}</p>
            </Link>
          ))}
        </div>

        {isPending ? (
          <div className="py-2 px-5 rounded-full border border-neutral-600">
            <Loader2 className="animate-spin" size={18} />
          </div>
        ) : session ? (
          <button
            onClick={() => signOut()}
            className="py-2 px-5 rounded-full border border-neutral-600 cursor-pointer"
          >
            HEY, {session.user.name.split(" ")[0].toUpperCase()}
          </button>
        ) : (
          <AuthModal
            trigger={
              <button className="py-2 px-5 rounded-full border border-neutral-600 cursor-pointer">
                LOGIN
              </button>
            }
          />
        )}
      </nav>
    </div>
  );
}
