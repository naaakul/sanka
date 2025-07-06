import React from 'react'
import Image from 'next/image'

const Navbar = () => {
  return (
    <div className='z-20 fixed w-full flex justify-between items-center p-8'>
      <div className='h-12 w-12 rounded-full flex justify-center items-center p-1 bg-[#0929341d]'>
        <Image src={"/logo.svg"} alt='logo' height={"100"} width={"100"}></Image>
      </div>
      <div className='text-black flex gap-5 font-medium'>
        <div className='h-8 flex items-center rounded-full bg-[#0929341d] px-5'>Home</div>
        <div className='h-8 flex items-center rounded-full bg-[#0929341d] px-5'>Our Story</div>
        <div className='h-8 flex items-center rounded-full bg-[#0929341d] px-5'>FAQ</div>
        <div className='h-8 flex items-center rounded-full bg-[#0929341d] px-5'>Policies</div>
      </div>
      <div className='h-12 w-12 rounded-full relative overflow-hidden bg-[#0929341d]'>
        <div className='absolute rounded-full left-1/2 -translate-x-1/2 -bottom-5 h-10 w-10 bg-[#092934]'></div>
        <div className='absolute rounded-full left-1/2 -translate-x-1/2 top-2 h-5 w-5 bg-[#092934]'></div>
      </div>
    </div>
  )
}

export default Navbar
