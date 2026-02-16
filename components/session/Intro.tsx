import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

const Intro = () => {
  return (
    <div className="w-full max-w-7xl text-[#d1d1d1] absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 px-4 sm:px-6 lg:px-8">
      {/* Mobile Layout */}
      <div className="flex flex-col gap-4 sm:hidden">
        <div className="flex justify-center">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ArrowDown className="w-5 h-5" />
          </motion.div>
        </div>
        <div className="text-center">
          <p className="text-sm leading-relaxed bg-black rounded-full">
            Generate everything———React components, AI agents, and animated
            videos—seamlessly in one unified platform. Sanka.pro is your
            all-in-one creative engine built for developers, designers, and
            dreamers to bring ideas to life effortlessly.
          </p>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex justify-between items-start gap-8 lg:items-center">
        <div className="flex-shrink-0">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ArrowDown className="w-5 h-5" />
          </motion.div>
        </div>
        <div className="flex-1 flex justify-center">
          <p className="w-full max-w-3xl text-xs leading-relaxed text-center lg:text-left bg-blac py-1 rounded-full">
            Generate everything———React components, AI agents, and animated
            videos—seamlessly in one unified platform. Sanka.pro is your
            all-in-one creative engine built for developers, designers, and
            dreamers to bring ideas to life effortlessly.
          </p>
        </div>
        <div className="flex-shrink-0 w-6 lg:w-8"></div>{" "}
        {/* Spacer for balance */}
      </div>
    </div>
  );
};

export default Intro;
