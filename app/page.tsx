'use client';

import Image from 'next/image';
import { cn } from "@/lib/utils"; // make sure this utility exists

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white text-gray-900 font-sans dark:bg-black">
      {/* Grid background layer */}
      <div
        className={cn(
          "absolute inset-0 z-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />

      {/* Radial gradient overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />

      {/* Main content */}
      <div className="relative z-20 flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 lg:px-24 py-2">

        {/* Left Text Column */}
        <div className="w-full lg:w-1/2 mb-16 lg:mb-0 px-20">
          <h1 className="text-4xl md:text-5xl leading-tight mb-6">
            Digital Pets That <br />
            <span className="text-gray-600 font-extrabold">Live & Evolve</span> <br />
            With You
          </h1>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
            Mint, nurture, and battle with unique companions that grow based on your interactions.
            Your Pixelated Pet evolves through on-chain activities and social engagement.
          </p>
          <button
            onClick={() => window.open('/generate', '_self')}
            className="bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-800 transition"
          >
            Mint Your Pet →
          </button>
        </div>

        {/* Right Image Column */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <Image
            src="/bg.png"
            alt="Pixelated Pet"
            width={420}
            height={420}
          />
        </div>
      </div>
    </main>
  );
}
