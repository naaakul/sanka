import AuthModal from "@/components/auth-modal";
import React from "react";
import Navbar from "@/components/session/Navbar";
import Hero from "@/components/session/Hero";

const page = () => {
  return (
    <div className="min-h-screen w-full">
      <Navbar/>
      <Hero/>
      {/* <AuthModal
        trigger={
          <button className="py-2 px-5 rounded-xl cursor-pointer bg-neutral-800">Login</button>
        }
      /> */}
    </div>
  );
};

export default page;
