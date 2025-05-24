'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '../navbar';
import BlurText from './BlurText';
import Image from 'next/image';

export default function SwimmingFishes() {
  const [isMounted, setIsMounted] = useState(false);
  
  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return (
    <div>
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{
        backgroundImage: `url('/back.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated',
      }}
    >
      <Navbar />
      
      {/* Main Text */}
      <div className="font-pixelify absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[40%] text-center z-10 space-y-4">
        {isMounted && (
          <>
            <div className="backdrop-blur-md p-4 rounded-lg">
              <BlurText
                text="Petropia"
                delay={300}
                animateBy="words"
                direction="top"
                onAnimationComplete={handleAnimationComplete}
                className="text-6xl md:text-7xl font-extrabold text-white drop-shadow-lg tracking-wide"
              />
              {/* <BlurText
                text="AI-generated NFT pets you can mint, evolve, and interact with "
                delay={150}
                animateBy="words"
                direction="top"
                className="text-lg md:text-2xl text-blue-100 font-medium max-w-3xl mx-auto px-4"
              /> */}
            </div>
            <div className="flex justify-center space-x-4 mt-8">
              <button
                onClick={() => window.location.href = '/generate'}
                className="px-12 py-3 text-white border-2 border-white font-pixelify rounded-md shadow-md hover:bg-green-700 transition"
              >
                Mint Your Own Pet
              </button>
              <button
                onClick={() => window.location.href = '/showcase'}
                className="px-12 py-3 text-white border-2 border-white font-pixelify rounded-md shadow-md hover:bg-green-700 transition"
              >
                Showcase
              </button>
            </div>
          </>
        )}
      </div>
      
      {/* Cat - Bottom Left */}
      <div className="absolute bottom-0 left-4 z-10" style={{ position: 'absolute' }}>
        {isMounted && (
          <Image
            src="/cat.gif"
            alt="Cat"
            width={280}
            height={280}
            style={{ objectFit: 'contain' }}
          />
        )}
      </div>
      
      {/* Dog - Bottom Right */}
      <div className="absolute bottom-0 right-4 z-10" style={{ position: 'absolute' }}>
        {isMounted && (
          <Image
            src="/dog.gif"
            alt="Dog"
            width={280}
            height={280}
            style={{ objectFit: 'contain' }}
          />
        )}
      </div>
    </div>
   
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-20"
      style={{
        backgroundImage: `url('/back.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated',
      }}
      id="info-section"
    >
       <div className="relative min-h-screen w-full flex items-center justify-center p-4">
    {/* Scrollable content box that takes 80% of viewport */}
    <div className="w-4/5 min-h-screen overflow-y-auto bg-white/95 rounded-lg shadow-lg p-4 flex items-center flex-col space-y-1">
     {/* <h1 className="font-pixelify text-xl md:text-5xl font-extrabold text-center text-gray-800 mb-6 p-4">
      About Petropia
    </h1> */}
    <BlurText
                text="About Petropia"
                delay={300}
                animateBy="words"
                direction="top"
                onAnimationComplete={handleAnimationComplete}
                className="text-4xl md:text-5xl font-extrabold text-[#875131] tracking-wide font-pixelify p-4"
              />
      
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="px-12 py-3 text-white border-2 border-white font-pixelify rounded-md shadow-md hover:bg-green-700 transition"
      >
        Back to Top
      </button>
    </div>
    </div>
    </div>
    </div>
  )
}