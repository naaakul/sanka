import AuthModal from "@/components/auth-modal";
import React from "react";

const page = () => {
  return (
    <div>
      <AuthModal
        trigger={
          <button className="text-sm text-blue-600 underline">Login</button>
        }
      />
    </div>
  );
};

export default page;
