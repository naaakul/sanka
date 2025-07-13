import React from "react";
import Navbar from "@/components/session/Navbar";
import Background from "@/components/ui/background";
import Builder from "@/components/session/builder";
import Intro from "@/components/session/Intro";

const page = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center w-full bg-black overflow-hidden">
      <Background/>
      <Navbar />
      <Builder/>
      <Intro/>
    </div>
  );
};

export default page;
