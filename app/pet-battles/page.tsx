'use client'
import { useAccounts } from "@mysten/dapp-kit"

export default function Home(){
    const account=useAccounts();
    return(
         <div className="relative min-h-screen w-full ">
  <div 
    className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat "
    style={{ backgroundImage: 'url(/bg-gen.png)' }}
  />
   <img 
        src="/totoro_bg.png" 
        alt="Totoro"
        className="absolute bottom-0 right-0 z-40 w-[250px] h-auto max-w-full md:max-w-[30%] sm:max-w-[40%]"
      />
  
  {/* Container for content with padding to center it */}
  <div className="relative min-h-screen w-full flex items-center justify-center p-4">
    {/* Scrollable content box that takes 80% of viewport */}
    <div className="w-4/5 min-h-screen overflow-y-auto bg-white bg-opacity-90 rounded-lg shadow-lg p-4 flex items-center  flex-col space-y-1">
    <h1 className="font-press-start-2p text-xl md:text-2xl font-extrabold text-center text-gray-800 mb-6">
      PvP Battle
    </h1>

    </div>
    </div>
    </div>
    )
}