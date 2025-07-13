import React from "react";

const background = () => {
  return (
    <div className="absolute z-0 -inset-y-[25%] -right-24 md:-right-6 w-[100vw] md:w-[1200px] flex flex-col blur-md [mask-image:linear-gradient(to_right,rgba(255,255,255,0),white)]">
      <div className="grow [background:conic-gradient(from_180deg_at_99.78%_35%_in_lab,white_18deg,#ffd086_36deg,rgba(17,17,17,0)_90deg,rgba(17,17,17,0)_342deg,white_360deg)]" />
      <div className="grow [background:conic-gradient(from_0deg_at_99.78%_65%_in_lab,white_0deg,rgba(17,17,17,0)_18deg,rgba(17,17,17,0)_270deg,#ffd086_324deg,white_342deg)]" />
    </div>
  );
};

export default background;
