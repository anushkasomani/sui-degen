// components/Navbar.tsx
'use client'

import { ConnectButton } from "@mysten/dapp-kit";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-center space-x-4 py-4 bg-[#abffd4] shadow-md">
      <ul className="flex space-x-6 text-sm font-medium">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/about">About</Link></li>
        <li><Link href="/contact">Contact</Link></li>
        <li><ConnectButton /></li>
      </ul>
    </nav>
  );
}
