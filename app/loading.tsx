// components/LogoWrapper.tsx
"use client";

import Image from "next/image";

export default function LogoWrapper() {
  return (
    <div className="h-screen w-full flex justify-center items-center bg-black">
      <Image src="/logo-anime.svg" alt="Sanka Logo" width={1200} height={1200} className="size-64"/>
    </div>
  );
}

// <Image alt="" src={"/logo.svg"} height={1000} width={1000}/>
