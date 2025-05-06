'use client'
import Navbar from "./navbar";
import FisheAnimation from "./components/FisheAnimation";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-gray-100">
     
      
        
        <div className="relative z-10">
          <FisheAnimation />
        
      </div>
    </main>
  );
}