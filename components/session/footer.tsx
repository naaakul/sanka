"use client";

import { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
// import { BackgroundGradientAnimation4 } from "../ui/Background3";
// import { BackgroundGradientAnimation3 } from "../ui/Background2";
import {
  BackgroundGradientAnimation1,
  // BackgroundGradientAnimation2,
} from "../ui/Background1";

const Footer = ({ ref }: { ref: any }) => {
  const boxRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        boxRef.current,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: boxRef.current,
            start: "top 80%",
            end: "top 50%",
            scrub: true,
          },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  const animations = [
    BackgroundGradientAnimation1,
    // BackgroundGradientAnimation2,
    // BackgroundGradientAnimation3,
    // BackgroundGradientAnimation4,
  ];

  const RandomBackground = useMemo(
    () => animations[Math.floor(Math.random() * animations.length)],
    [],
  );

  return (
    <footer
      className="absolute top-0 w-full h-[22rem] z-10"
      ref={ref}
    >
      <div
        className="sticky mx-[2rem] z-30 bottom-0 bg-[#3B82F6] rounded-[36px] left-0 h-80 flex justify-center items-center overflow-hidden"
        style={{ opacity: 1, transform: "none" }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 blur-[100px]">
            <RandomBackground />
          </div>
          <div className="relative overflow-hidden w-full h-full flex justify-end px-12 text-right items-start py-12 text-white">
            <div className="flex justify-between w-full sm:text-lg md:text-xl">
              <p className="text-white/60 text-sm">Last updated: 21-08-2025</p>
              <ul>
                <li className="hover:underline cursor-pointer">
                  <a target="_blank" href="https://x.com/heynakul">
                    X
                  </a>
                </li>
                <li className="hover:underline cursor-pointer">
                  <a target="_blank" href="https://github.com/naaakul">
                    Github
                  </a>
                </li>
                <li className="hover:underline cursor-pointer">
                  <a
                    target="_blank"
                    href="https://linkedin.com/in/nakul-chouksey/"
                  >
                    Linkedin
                  </a>
                </li>
              </ul>
            </div>
            <h2 className="absolute -bottom-4 josefin-sans left-0 translate-y-1/3 sm:text-[192px] text-[128px] text-white font-black tracking-tighter">
              <span className="hidden sm:inline -tracking-tighter">SAÑKA.</span>
              <span className="inline sm:hidden -tracking-tighter">SAÑ</span>
            </h2>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// import Image from "next/image";

// const Footer = ({ ref }: { ref: any }) => (
//   <div ref={ref} className="absolute top-0 w-full h-[22rem] z-10">
//     <div className="flex h-80 mx-[2rem] gap-5">
//       <div className="h-full w-1/3 rounded-3xl gradient-box"></div>
//       <div className="h-full flex-1 bg-neutral-200 rounded-3xl"></div>
//     </div>
//   </div>
// );

// export default Footer;
