"use client"
export default function Home() {  
  return (
    <main>
      
      <button onClick={()=> window.open('/generate', '_self')} className="bg-[#abffd4] text-black font-bold py-2 px-4 rounded">
      generate your own nft pet
    </button>
        </main>
    
  )
}