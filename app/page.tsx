"use client";

import Navbar from "@/components/session/Navbar";
import Background from "@/components/ui/background";
import Builder from "@/components/session/builder";
import Intro from "@/components/session/Intro";
import Hero from "@/components/session/Hero";
import Cards from "@/components/session/Cards";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "@/components/session/footer";

gsap.registerPlugin(ScrollTrigger);

const page = () => {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!parentRef.current || !boxRef.current) return;

    ScrollTrigger.create({
      trigger: boxRef.current,
      // markers: true,
      start: "100% 100%",
      end: () => ScrollTrigger.maxScroll(window),
      pin: true,
      pinSpacing: false,
    });
  }, []);

  return (
    <>
      <div className="relative min-h-screen flex flex-col items-center justify-center w-full bg-background overflow-hidden">
        <Background />
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 min-h-screen pt-20 pb-20">
          <Builder />
          <Intro />
        </main>
      </div>
      <Hero />

      <div ref={parentRef} className="h-[55.5rem] relative z-50 ">
        <Cards />
        <Footer ref={boxRef} />
      </div>
    </>
  );
};

export default page;
