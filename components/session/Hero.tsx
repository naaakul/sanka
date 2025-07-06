import React from 'react'

const Hero = () => {
  return (
    <div className='z-20 fixed bottom-0 flex flex-col justify-center items-center w-full gap-2 text-white'>
      <div className='h-2 w-2 bg-white rounded full'></div>
      <p className='className="bg-[rgba(64,64,64,0.14)] text-sm border-[0.7px] border-[#2A2A2A] backdrop-blur-[2.8px] rounded-full py-1.5 px-6'>1,252 People are on matrix</p>
      <p className='text-6xl'>Clarity in <span>Complexity</span></p>
      <p>We help you to generate everyting help you to generate everyting help you to generate everyting help you to generate everyting.</p>
      <button className='bg-white rounded-full text-black py-2 px-5'>Get Started</button>
    </div>
  )
}

export default Hero
