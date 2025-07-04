import AuthModal from "@/components/auth-modal";
import React from "react";

const page = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <AuthModal
        trigger={
          <button className="py-2 px-5 rounded-xl cursor-pointer bg-neutral-800">Login</button>
        }
      />
    </div>
  );
};

export default page;
