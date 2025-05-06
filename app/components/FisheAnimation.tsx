'use client';
import { useState, useEffect, useRef } from 'react';
import Navbar from '../navbar';
import BlurText from './BlurText';
import Image from 'next/image';

export default function SwimmingFishes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const { width, height } = containerRef.current.getBoundingClientRect();
    setDimensions({ width, height });

    const handleResize = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-gradient-to-b from-purple-900 to-purple-600 overflow-hidden" // Changed background gradient to purple
    >
      <Navbar />

      {/* Main Text */}
      <div className="font-pixelify absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[40%] text-center z-10 space-y-4">
        <BlurText
          text="Token Tails"
          delay={300}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleAnimationComplete}
          className="text-6xl md:text-7xl font-extrabold text-white drop-shadow-lg tracking-wide"
        />
        <BlurText
          text="AI-generated NFT pets you can mint, evolve, and interact with "
          delay={150}
          animateBy="words"
          direction="top"
          className="text-lg md:text-2xl text-blue-100 font-medium max-w-3xl mx-auto px-4"
        />
        <div className="flex justify-center space-x-4 mt-8"> {/* Added buttons below the text */}
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
      </div>

      {/* Cat - Bottom Left */}
      <div className="absolute bottom-0 left-4 w-70 h-70 z-10">
        <Image src="/cat.gif" alt="Cat" fill style={{
             objectFit: 'contain' }} />
      </div>

      {/* Dog - Bottom Right */}
      <div className="absolute bottom-0 right-4 w-70 h-70 z-10">
        <Image src="/dog.gif" alt="Dog" fill style={{ objectFit: 'contain' }} />
      </div>

    
    </div>
  );
}
