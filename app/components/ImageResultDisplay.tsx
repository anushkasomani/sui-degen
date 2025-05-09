"use client";
import { Button } from "./ui/button";
import { Download, RotateCcw, MessageCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import { HistoryItem, HistoryPart } from "@/lib/types";

interface ImageResultDisplayProps {
  imageUrl: string;
  backstory: string | null;
  petName: string | null;
  onReset: () => void;
  conversationHistory?: HistoryItem[];
  onMintNFT?: () => Promise<any>; // New prop for minting NFT
}

export function ImageResultDisplay({
  imageUrl,
  backstory,
  petName,
  onReset,
  conversationHistory = [],
  onMintNFT, // New prop
}: ImageResultDisplayProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [isMinting, setIsMinting] = useState(false); // Track minting state
  const [mintStatus, setMintStatus] = useState<string | null>(null); // Track minting status

  const handleDownload = () => {
    // Create a temporary link element
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `gemini-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  // New function to handle minting NFT
  const handleMintNFT = async () => {
    if (!onMintNFT) return;
    
    try {
      setIsMinting(true);
      setMintStatus("Minting your NFT pet...");
      
      // Call the provided mint function
      const result = await onMintNFT();
      
      // Show success with IPFS link if available
      if (result?.metadata?.url) {
        setMintStatus(`Success! Your NFT pet is now stored on IPFS: ${result.metadata.url}`);
      } else {
        setMintStatus("Your NFT pet has been minted successfully!");
      }
    } catch (error) {
      console.error("Minting error:", error);
      setMintStatus(`Failed to mint: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="p-6">
      

<div className="flex flex-col md:flex-row justify-between space-x-0 md:space-x-10">
 <div className="rounded-lg  bg-muted p-1">
        <img
          src={imageUrl}
          alt="Generated"
          className="max-w-[320px] h-auto w-[300px]"
        />
      </div>
     
       <div className="flex flex-col ">
         <div className="p-1 rounded-lg bg-muted">
          
          <h1 className="text-2xl text-muted-foreground font-pixelify">{petName}</h1>
        </div>
     
      
        <div className="p-1 rounded-lg bg-muted">
          <h3 className="text-xl font-medium mb-2 font-pixelify">Lore-</h3>
          <p className="text-md text-muted-foreground font-courier-prime">{backstory}</p>
        </div>
       </div>
      <div className="flex items-center justify-between">
        
        <div className="space-x-2 flex flex-col space-y-2">
          <Button className="outline sm bg-[#C9C9AA] font-pixelify" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          {conversationHistory.length > 0 && (
            <Button className="outline sm bg-[#C9C9AA] font-pixelify" onClick={toggleHistory}>
              <MessageCircle className="w-4 h-4 mr-2" />
              {showHistory ? "Hide History" : "Show History"}
            </Button>
          )}
          <Button className="outline sm bg-[#C9C9AA] font-pixelify" onClick={onReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Create New Image
          </Button>
          {onMintNFT && (
          <Button
        onClick={handleMintNFT}
        disabled={isMinting}
        className="outline sm bg-cyan-500 hover:bg-cyan-600 text-white font-pixelify"
          >
        <Sparkles className="w-4 h-4 mr-2" />
        {isMinting ? "Minting NFT..." : "Mint NFT Pet"}
          </Button>
        )}
        </div>
      </div>
</div>

      {onMintNFT && (
        <div className="mt-4 flex flex-col items-center">
         
          
          {/* Show mint status message */}
          {mintStatus && (
            <div className={`mt-2 p-3 rounded-md w-full text-sm ${
              mintStatus.includes("Failed") || mintStatus.includes("failed")
                ? "bg-red-100 text-red-700"
                : mintStatus.includes("Success") || mintStatus.startsWith("Your NFT")
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700"
            }`}>
              {mintStatus}
            </div>
          )}
        </div>
      )}

      {showHistory && conversationHistory.length > 0 && (
        <div className="p-4 rounded-lg font-courier-prime">
          <h3 className="text-sm font-medium mb-2">Conversation History</h3>
          <div className="space-y-4">
            {conversationHistory.map((item, index) => (
              <div key={index} className={`p-3 rounded-lg bg-secondary`}>
                <p
                  className={`text-sm font-medium mb-1 ${
                    item.role === "user" ? "text-foreground" : "text-primary"
                  }`}
                >
                  {item.role === "user" ? "You" : "Gemini"}
                </p>
                <div className="space-y-1">
                  {item.parts.map((part: HistoryPart, partIndex) => (
                    <div key={partIndex}>
                      {part.text && <p className="text-sm">{part.text}</p>}
                      {part.image && (
                        <div className="mt-2 overflow-hidden rounded-md">
                          <img
                            src={part.image}
                            alt={`${item.role} image`}
                            className="object-contain w-[300px] h-auto"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}