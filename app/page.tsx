"use client"

import Navbar from "@/components/session/Navbar"
import Background from "@/components/ui/background"
import Builder from "@/components/session/builder"
import Intro from "@/components/session/Intro"

const page = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center w-full bg-black overflow-hidden">
      <Background />
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 min-h-screen pt-20 pb-20">
        <Builder />
        <Intro />
      </main>
    </div>
  )
}

export default page
