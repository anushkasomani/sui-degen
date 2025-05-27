"use client";

import { ConnectButton } from "@mysten/dapp-kit";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 md:px-12 lg:px-24 py-5 border-4 border-white bg-green-80 m-4">
      <div className="text-base sm:text-lg md:text-xl font-pixelify text-yellow-300">
        PetroPia!
      </div>

      <ul className="hidden md:flex space-x-8 text-xl font-bold font-pixelify text-[#8B4513]">
        <li>
          <Link href="/" className="hover:text-yellow-300 transition-colors">
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/battle"
            className="hover:text-yellow-300 transition-colors"
          >
            Battle
          </Link>
        </li>
        <li>
          <Link
            href="/showcase"
            className="hover:text-yellow-300 transition-colors"
          >
            Showcase
          </Link>
        </li>

           <li>
          <Link
            href="/showcase"
            className="hover:text-yellow-300 transition-colors"
          >
            About
          </Link>
        </li>
       
        
      </ul>

      <div className="ml-4">
        <div className="font-pixelify">
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}
