import { ArrowDown } from "lucide-react";
import React from "react";

const Intro = () => {
  return (
    <div className="w-full xl:max-w-7xl text-[#d1d1d1] h-12 mt-auto mb-6 flex justify-between items-center">
      <ArrowDown />
      <div className="w-full flex justify-center">
        <p className="w-full xl:max-w-3xl text-sm">
          Generate everything———React components, AI agents, and animated
          videos—seamlessly in one unified platform. Sanka.pro is your
          all-in-one creative engine built for developers, designers, and
          dreamers to bring ideas to life effortlessly.
        </p>
      </div>
    </div>
  );
};

export default Intro;
