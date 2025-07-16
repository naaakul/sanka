"use client";

import { useState } from "react";
import AuthModal from "../auth-modal";
import Image from "next/image";
import Link from "next/link";
import { createAuthClient } from "better-auth/react";
import { Loader2, Menu, X } from "lucide-react";

export const { useSession, signIn, signOut } = createAuthClient();

const navTags = [
  { name: "SANKA", href: "/" },
  { name: "ABOUT", href: "/about" },
  { name: "PRIVACY POLICY", href: "/privacy-policy" },
  { name: "HOW TO USE", href: "/how-to-use" },
];

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 xl:max-w-7xl fixed top-0 z-50">
      <nav className="flex items-center justify-between gap-4 py-4 lg:h-20 text-sm">
        <div className="flex gap-9">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo-w.svg"
              alt="Logo"
              height={32}
              width={32}
              className="sm:h-10 sm:w-10"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex gap-6 xl:gap-9 items-center">
            {navTags.map((e) => (
              <Link key={e.name} href={e.href}>
                <p className="text-neutral-500 hover:text-white transition-colors duration-200 text-xs xl:text-sm">
                  {e.name}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop Auth Button */}
        <div className="hidden lg:block">
          {isPending ? (
            <div className="py-2 px-4 xl:px-5 rounded-full border border-neutral-600">
              <Loader2 className="animate-spin" size={16} />
            </div>
          ) : session ? (
            <button
              onClick={() => signOut()}
              className="py-2 px-4 xl:px-5 rounded-full border border-neutral-600 cursor-pointer hover:border-neutral-400 transition-colors duration-200 text-xs xl:text-sm"
            >
              HEY, {session.user.name.split(" ")[0].toUpperCase()}
            </button>
          ) : (
            // <AuthModal
            //   trigger={
            <Link href={"/auth/sign-in"}>
              <button className="py-2 px-4 xl:px-5 rounded-full border border-neutral-600 cursor-pointer hover:border-neutral-400 transition-colors duration-200 text-xs xl:text-sm">
                LOGIN
              </button>
            </Link>
            // }
            // />
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded-md text-neutral-400 hover:text-white transition-colors duration-200"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-t border-neutral-800 rounded-b-lg">
          <div className="px-4 py-6 space-y-4">
            {navTags.map((e) => (
              <Link
                key={e.name}
                href={e.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-neutral-500 hover:text-white transition-colors duration-200"
              >
                {e.name}
              </Link>
            ))}

            {/* Mobile Auth */}
            <div className="pt-4 border-t border-neutral-800">
              {isPending ? (
                <div className="py-3 px-4 rounded-full border border-neutral-600 text-center">
                  <Loader2 className="animate-spin mx-auto" size={16} />
                </div>
              ) : session ? (
                <button
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-3 px-4 rounded-full border border-neutral-600 cursor-pointer hover:border-neutral-400 transition-colors duration-200"
                >
                  HEY, {session.user.name.split(" ")[0].toUpperCase()}
                </button>
              ) : (
                <AuthModal
                  trigger={
                    <button
                      className="w-full py-3 px-4 rounded-full border border-neutral-600 cursor-pointer hover:border-neutral-400 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      LOGIN
                    </button>
                  }
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
