'use client';

import { ConnectButton } from "@mysten/dapp-kit";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 md:px-12 lg:px-24 py-5 bg-white shadow-sm">
      {/* Logo / Brand */}
      <div className="text-2xl font-extrabold tracking-tight text-gray-700">
        Pixelated Pets
      </div>

      {/* Nav Links */}
      <ul className="hidden md:flex space-x-10 text-md font-medium text-gray-700">
        <li>
          <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
        </li>
        <li>
          <Link href="/about" className="hover:text-indigo-600 transition-colors">About</Link>
        </li>
        <li>
          <Link href="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link>
        </li>
      </ul>

      {/* Connect Wallet */}
      <div className="ml-4">
        <ConnectButton />
      </div>
    </nav>
  );
}
