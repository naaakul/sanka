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

const PlaygroundNavbar = () => {
  const { data: session, isPending } = useSession();

  return (
    <div className="flex items-center px-4 py-1 justify-between">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/logo-w.svg"
            alt="Logo"
            height={32}
            width={32}
            className="sm:h-10 sm:w-10"
          />
        </Link>

        <span
          aria-hidden="true"
          className="text-neutral-700 w-4 min-w-4 select-none text-center text-lg"
        >
          /
        </span>

        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Smart terminal CLI</NavigationMenuTrigger>
              <NavigationMenuContent className="z-20">
                <ul className="grid w-[200px] gap-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="#">Components</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="#">Documentation</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="#">Blocks</Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
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
