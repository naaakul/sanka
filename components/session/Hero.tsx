import Image from "next/image";
import { motion } from "framer-motion";
import React from "react";
import { ArrowDown } from "lucide-react";

const Hero = () => {
  return (
    <div className="min-h-screen relative w-full flex justify-center items-end">
      <div className="flex flex-col justify-center items-center mb-8">
        <p className="text-white/50">Build Apps Without Limits</p>
        <p className="text-8xl font-bold text-center leading-[4.8rem]">Describe. Generate. <br /> Ship. Repeat.</p>
        <div className="flex justify-center">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mt-60"
          >
            <ArrowDown size={80} strokeWidth={1}/>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute size-60 top-[22rem] left-[30rem]"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image alt="" src="/ctrl.webp" height={761} width={748} />
      </motion.div>

      <motion.div
        className="absolute size-52 top-[22rem] left-[41rem]"
        animate={{ y: [0, -18, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.4,
        }}
      >
        <Image alt="" src="/c.webp" height={586} width={632} />
      </motion.div>

      <motion.div
        className="absolute size-52 top-[22rem] left-[52rem]"
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.8,
        }}
      >
        <Image alt="" src="/v.webp" height={615} width={615} />
      </motion.div>
    </div>
  );
};

export default Hero;
