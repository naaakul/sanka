"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { createAuthClient } from "better-auth/react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";

export const { useSession, signIn, signOut } = createAuthClient();

interface SidebarProps {
  handleEnter: () => void;
  handleLeave: () => void;
}

const PlaygroundNavbar = ({ handleEnter, handleLeave }: SidebarProps) => {
  const { data: session, isPending } = useSession();

  return (
    <div className="flex items-center px-4 py-1 justify-between">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex-shrink-0">
          <button
            type="button"
            aria-label="Open side menu"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            className="pointer-events-auto"
          >
            <Image
              src="/logo-w.svg"
              alt="Logo"
              height={32}
              width={32}
              className="sm:h-10 sm:w-10"
            />
          </button>
        </Link>

        <span
          aria-hidden="true"
          className="text-neutral-700 w-4 min-w-4 select-none text-center text-lg"
        >
          /
        </span>
        <p>Sanka Playground</p>
      </div>

      {isPending ? (
        <Image
          src={"https://avatars.githubusercontent.com/u/178046049?s=200&v=4"}
          alt="User Profile"
          width={40}
          height={40}
          className="rounded-full size-8"
        />
      ) : (
        session && (
          <Image
            src={
              session.user.image ??
              "https://avatars.githubusercontent.com/u/178046049?s=200&v=4"
            }
            alt="User Profile"
            width={40}
            height={40}
            className="rounded-full size-8"
          />
        )
      )}
    </div>
  );
};

export default PlaygroundNavbar;
