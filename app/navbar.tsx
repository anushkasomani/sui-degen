'use client';

import { ConnectButton } from "@mysten/dapp-kit";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 md:px-12 lg:px-24 py-5 border-4 border-white bg-green-800 m-4"> {/* Added margin outside the border */}
      {/* Logo / Brand */}
      <div className="text-base sm:text-lg md:text-xl font-pixelify text-yellow-300">
        Pixelated Pets
      </div>

      {/* Nav Links */}
      <ul className="hidden md:flex space-x-40 text-lg sm:text-md font-pixelify text-white">
        <li>
          <Link href="/" className="hover:text-yellow-300 transition-colors">Home</Link>
        </li>
        <li>
          <Link href="/about" className="hover:text-yellow-300 transition-colors">About</Link>
        </li>
        <li>
          <Link href="/contact" className="hover:text-yellow-300 transition-colors">Contact</Link>
        </li>
      </ul>

      {/* Connect Wallet */}
      <div className="ml-4">
        <div className="font-pixelify">
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}
