// import React from "react";

// const background = () => {
//   return (
//     <div className="absolute z-0 -inset-y-[25%] -right-24 md:-right-6 w-[100vw] md:w-[1200px] flex flex-col blur-md [mask-image:linear-gradient(to_right,rgba(255,255,255,0),white)]">
//       <div className="grow [background:conic-gradient(from_180deg_at_99.78%_35%_in_lab,white_18deg,#ffd086_36deg,rgba(17,17,17,0)_90deg,rgba(17,17,17,0)_342deg,white_360deg)]" />
//       <div className="grow [background:conic-gradient(from_0deg_at_99.78%_65%_in_lab,white_0deg,rgba(17,17,17,0)_18deg,rgba(17,17,17,0)_270deg,#ffd086_324deg,white_342deg)]" />
//     </div>
//   );
// };

// export default background;



"use client";

import { useEffect } from "react";

const UnicornStudio = () => {
  useEffect(() => {
    if (!(window as any).UnicornStudio) {
      const script = document.createElement("script");
      script.src = "/js/unicornStudio.umd.js";
      script.async = true;
      script.onload = () => {
        if (!(window as any).UnicornStudio.isInitialized) {
          (window as any).UnicornStudio.init();
          (window as any).UnicornStudio.isInitialized = true;
        }
      };
      document.body.appendChild(script);
    } else {
      if (!(window as any).UnicornStudio.isInitialized) {
        (window as any).UnicornStudio.init();
        (window as any).UnicornStudio.isInitialized = true;
      }
    }
  }, []);

  return (
    <div
      data-us-project="cOmwWnLRdXHHE4l2CkxK"
      className="w-full h-full absolute inset-0"
    ></div>
  );
};

export default UnicornStudio;

