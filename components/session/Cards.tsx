import Image from "next/image";
import { motion } from "framer-motion";


const Cards = () => {
  return (
   <div className="w-full py-24 flex flex-col gap-7 items-center justify-center">
      
      <div className="flex gap-7">
        
        <div className="h-48 w-[30rem] flex flex-col justify-center rounded-3xl bg-gradient-to-br from-[#c6c4c6] via-[#c9c7c7] to-white overflow-hidden relative">
          <p className="ml-5 text-black font-bold text-2xl">Prompt to Product</p>
          <p className="ml-5 text-black/60 font-semibold">Instant UI Generation</p>

          <motion.div
            className="absolute -right-12 size-64 -top-2"
            animate={{ y: [0, -6, 6, -6, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Image
              alt=""
              height={3274}
              width={3057}
              src="/cardElem2.webp"
            />
          </motion.div>

          <div className="absolute inset-0 shadow-[inset_-20px_20px_50px_rgba(255,255,255,0.6)] pointer-events-none"></div>
        </div>

        <div className="h-48 w-[30rem] flex flex-col justify-center rounded-3xl bg-gradient-to-br from-[#f0a8eb] via-[#E0A5DC] to-[rgb(255,231,253)] overflow-hidden relative">
          <p className="ml-5 text-black font-bold text-2xl">Describe Your Vision</p>
          <p className="ml-5 text-black/60 font-semibold">Components Assemble Themselves</p>

          <motion.div
            className="absolute -right-5 size-56 top-2"
            animate={{ y: [0, -6, 6, -6, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Image
              alt=""
              height={3274}
              width={3057}
              src="/cardElem3.webp"
            />
          </motion.div>

          <div className="absolute inset-0 shadow-[inset_-20px_20px_50px_rgba(255,231,253,0.6)] pointer-events-none"></div>
        </div>
      </div>

      <div className="flex gap-7">
        
        <div className="h-48 w-[30rem] flex flex-col justify-center rounded-3xl bg-gradient-to-br from-[#9A8DDC] via-[#b6abef] to-[rgb(219,216,236)] overflow-hidden relative">
          <p className="ml-5 text-black font-bold text-2xl">Intent Driven Building</p>
          <p className="ml-5 text-black/60 font-semibold">Logic Without Friction</p>

          <motion.div
            className="absolute -right-4 size-56 top-2"
            animate={{ y: [0, -6, 6, -6, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Image
              alt=""
              height={2015}
              width={1739}
              src="/cardElem4.webp"
            />
          </motion.div>

          <div className="absolute inset-0 shadow-[inset_-20px_20px_50px_rgba(219,216,236,0.6)] pointer-events-none"></div>
        </div>

        <div className="h-48 w-[30rem] flex flex-col justify-center rounded-3xl bg-gradient-to-br from-[#c6c4c6] via-[#c9c7c7] to-white overflow-hidden relative">
          <p className="ml-5 text-black font-bold text-2xl">Iterate At Thought Speed</p>
          <p className="ml-5 text-black/60 font-semibold">Refine Remix Rebuild</p>

          <motion.div
            className="absolute -right-5 size-64 -top-2"
            animate={{ y: [0, -6, 6, -6, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Image
              alt=""
              height={3274}
              width={3057}
              src="/cardElem1.webp"
            />
          </motion.div>

          <div className="absolute inset-0 shadow-[inset_-20px_20px_50px_rgba(255,255,255,0.6)] pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
