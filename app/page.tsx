import AuthModal from "@/components/auth-modal";
import React from "react";
import Navbar from "@/components/session/Navbar";
import Hero from "@/components/session/Hero";

const page = () => {
  return (
    <div className="min-h-screen w-full relative text-[#f8faf933]">
      <div className="h-full w-full z-10 absolute bg-[radial-gradient(220%_100%_at_50%_100%,_#092934,_#092934,_#1D4048,_#436067,_#698086,_#A4B2B4,_#E2E5E6,_#F8FAF9)]"></div>
      <div className="h-full w-full z-10 absolute bg-[linear-gradient(to_right,#f8faf933_1px,transparent_1px),linear-gradient(to_bottom,#f8faf933_1px,transparent_1px)] bg-[size:10px_10px] overflow-hidden"></div>
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
