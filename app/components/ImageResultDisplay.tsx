"use client";
import { Button } from "./ui/button";
import { Download, RotateCcw, MessageCircle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { HistoryItem, HistoryPart } from "@/lib/types";
import toast from "react-hot-toast";
import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useSuiClient } from "@mysten/dapp-kit";
import { ConnectButton } from "@mysten/dapp-kit";

const NFT_Collection_ID="0x7208c789a817a2aed6736673274669ff0ae78b29854d003137d451bd2f8c69f6"
const package_id="0x694dbe3915180f195f1e1a05623d7c3e2e26a08533afacb29c9a1d12dcc22c10"
 
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
   const client = useSuiClient();
  const { mutate: signAndExecute, isPending: isMinting } =
    useSignAndExecuteTransaction();
  const [showHistory, setShowHistory] = useState(false);
  const [isMint, setIsMint] = useState(false); 
  const [mintStatus, setMintStatus] = useState<string | null>(null);
  const [imgUrl, setImgUrl] = useState<string>("intial"); 
  function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);

  if (!mimeMatch) {
    throw new Error('Invalid base64 image');
  }

  const mime = mimeMatch[1];
  const bstr = atob(arr[1]); // Decode base64 string
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}
useEffect(()=>{
const file = base64ToFile(imageUrl, "image.png");
console.log(file);
},[])
  const handleDownload = () => {
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

const handleMintNFT = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsMint(true)
  const file = base64ToFile(imageUrl, "image.png");
    if (!file) {
      throw Error("no file!")
      setIsMint(false) 
    }

    try {
      
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json();
      console.log("result is", result);
      console.log("cid is ", result.cid)
      console.log("url is", result.url)
      setIsMint(false)
   
      setImgUrl(result.url)
      //Transaction block 
      const txb = new Transaction();
      txb.moveCall({
      target: `${package_id}::tailz::mint`,
      arguments: [
        txb.object(NFT_Collection_ID),
        txb.pure.string(result.url),
      ],
    })

    signAndExecute(
      {
        transaction: txb,
      },
      {
        onSuccess: async ({ digest }) => {
             toast.success("NFT Minted")
          const { effects } = await client.waitForTransaction({
            digest,
            options: {
              showEffects: true,
            },
          });
        },
      }
    );
    
    } catch (err) {
      console.error("Upload error:", err);
      setIsMint(false)
    }
  };

//   const trying= async ()=>{
//     console.log(imgUrl)
// const txb = new Transaction();
//       txb.moveCall({
//       target: `${package_id}::tailz::mint`,
//       arguments: [
//         txb.object(NFT_Collection_ID),
//         txb.pure.string("https://gateway.pinata.cloud/ipfs/bafybeidnlei5tnm5hfsc4qhukzqa5gv3xuggtnri4nwctbr7es256uxw4e"),
//       ],
//     })

//     signAndExecute(
//       {
//         transaction: txb,
//       },
//       {
//         onSuccess: async ({ digest }) => {
//           const { effects } = await client.waitForTransaction({
//             digest,
//             options: {
//               showEffects: true,
//             },
//           });
//         },
//       }
//     );
//   }




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
          <ConnectButton/>

      
    
        <h1 className="text-2xl text-muted-foreground font-pixelify">{petName}</h1>
        </div>
     
      
        <div className="p-1 rounded-lg bg-muted">
          <h3 className="text-xl font-medium mb-2 font-pixelify">Lore-</h3>
          <p className="text-md text-muted-foreground font-courier-prime">{backstory}</p>
        </div>
       </div>
      <div className="flex items-center justify-between">
        
        <div className="space-x-2 flex flex-col space-y-2">
          <Button className="outline sm bg-[#C9C9AA] font-pixelify" onClick={handleDownload} disabled={isMint}>
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
        {/* <button onClick={trying}>try</button> */}
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