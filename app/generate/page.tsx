"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon, Wand2 } from "lucide-react";
import { HistoryItem } from "@/lib/types";
import { ImageUpload } from "../components/ImageUpload";
import { ImagePromptInput } from "../components/ImagePromptInput";
import { ImageResultDisplay } from "../components/ImageResultDisplay";

export default function GenerateImage() {
  const [image, setImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [backstory, setBackstory] = useState<string | null>(null);
  const [petName, setPetName] = useState<string | null>(null);
  const [storageStatus, setStorageStatus] = useState<string | null>(null);
  // Track if the current image is already stored on IPFS
  const [isStoredOnIPFS, setIsStoredOnIPFS] = useState<boolean>(false);
  // Store metadata for minting
  const [storedMetadata, setStoredMetadata] = useState<any>(null);

  const handleImageSelect = (imageData: string) => {
    setImage(imageData || null);
    // Reset storage status when new image is selected
    setIsStoredOnIPFS(false);
    setStoredMetadata(null);
  };

  // Helper function to upload image to backend
  const uploadImageToBackend = async (
    imageDataUrl: string,
    filename: string
  ) => {
    try {
      // Convert data URL to blob
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();

      // Create form data
      const formData = new FormData();
      formData.append("image", blob, filename);

      // Upload to backend
      const uploadResponse = await fetch(`${UPLOAD_SERVICE_URL}/upload/image`, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || "Image upload failed");
      }

      return await uploadResponse.json();
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  // Helper function to upload metadata to backend
  const uploadMetadataToBackend = async (metadata: any) => {
    try {
      const uploadResponse = await fetch(
        `${UPLOAD_SERVICE_URL}/upload/metadata`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: metadata }),
        }
      );

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || "Metadata upload failed");
      }

      return await uploadResponse.json();
    } catch (error) {
      console.error("Error uploading metadata:", error);
      throw error;
    }
  };

  const handlePromptSubmit = async (prompt: string, userBackstory: string, artStyle: string) => {
    try {
      setLoading(true);
      setError(null);
      setStorageStatus(null);
      // Reset storage status when generating new image
      setIsStoredOnIPFS(false);
      setStoredMetadata(null);

      const imageToEdit = generatedImage || image;

      const requestData = {
        prompt,
        image: imageToEdit,
        history: history.length > 0 ? history : undefined,
        backstory: userBackstory || null,
        artStyle: artStyle || null,
      };

      const response = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate image");
      }

      const data = await response.json();

      if (data.image) {
        setGeneratedImage(data.image);
        setBackstory(data.backstory || userBackstory || null);
        setPetName(data.petName || null);

        const userMessage: HistoryItem = {
          role: "user",
          parts: [
            { text: prompt },
            ...(imageToEdit ? [{ image: imageToEdit }] : []),
          ],
        };

        const aiResponse: HistoryItem = {
          role: "model",
          parts: [
            ...(data.description ? [{ text: data.description }] : []),
            ...(data.image ? [{ image: data.image }] : []),
          ],
        };

        const updatedHistory = [...history, userMessage, aiResponse];
        setHistory(updatedHistory);
      } else {
        setError("No image returned from API");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error processing request:", err);
    } finally {
      setLoading(false);
    }
  };

  // New function to handle NFT minting (uploading to IPFS)
  const handleMintNFT = async () => {
    if (isStoredOnIPFS && storedMetadata) {
      // Already stored, just return the existing data
      return storedMetadata;
    }
    
    setStorageStatus("Storing to decentralized storage...");
    
    try {
      const imageToStore = generatedImage;
      if (!imageToStore) {
        throw new Error("No image available to mint");
      }

      // Create structured metadata for storage
      const metadata = {
        name: petName || "AI Pet NFT",
        description: backstory || "A unique AI-generated pet NFT",
        prompt: history.length > 0 
          ? history[history.length - 2]?.parts[0]?.text 
          : "AI-generated pet",
        petName: petName || null,
        backstory: backstory || null,
        timestamp: new Date().toISOString(),
        history: history,
      };

      // Upload the generated image
      const imageUploadResult = await uploadImageToBackend(
        imageToStore,
        `pet_nft_${Date.now()}.png`
      );

      // Include the image CID in metadata
      metadata.imageCid = imageUploadResult.cid;
      metadata.imageUrl = imageUploadResult.url;

      // Upload the metadata
      const metadataResult = await uploadMetadataToBackend(metadata);

      console.log("Storage complete:", {
        image: imageUploadResult,
        metadata: metadataResult,
      });

      // Store the results
      setStoredMetadata({
        image: imageUploadResult,
        metadata: metadataResult
      });
      setIsStoredOnIPFS(true);
      setStorageStatus("Successfully stored to decentralized storage!");
      
      return {
        image: imageUploadResult,
        metadata: metadataResult
      };
    } catch (error) {
      console.error("Storage error:", error);
      setStorageStatus(`Storage error: ${error}`);
      throw error;
    }
  };

  const handleReset = () => {
    setImage(null);
    setGeneratedImage(null);
    setDescription(null);
    setLoading(false);
    setError(null);
    setHistory([]);
    setStorageStatus(null);
    setIsStoredOnIPFS(false);
    setStoredMetadata(null);
  };

  const currentImage = generatedImage || image;
  const isEditing = !!currentImage;
  const displayImage = generatedImage;

  return (
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
    <div className="w-4/5 min-h-screen overflow-y-auto bg-white bg-opacity-90 rounded-lg shadow-lg p-4 flex items-center justify-center flex-col space-y-1">
    <h1 className="font-press-start-2p text-xl md:text-2xl font-extrabold text-center text-gray-800 mb-6">
      Create Your Pet
    </h1>
          {error && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}
          
          {storageStatus && (
            <div
              className={`p-4 mb-4 text-sm rounded-lg ${
                storageStatus.includes("error")
                  ? "text-amber-700 bg-amber-100"
                  : storageStatus.includes("Success")
                  ? "text-green-700 bg-green-100"
                  : "text-blue-700 bg-blue-100"
              }`}
            >
              {storageStatus}
            </div>
          )}
          
          {!displayImage && !loading ? (
            <>
              <div className="w-[50%]">
                <ImageUpload
                onImageSelect={handleImageSelect}
                currentImage={currentImage}
              />
              </div>
              <ImagePromptInput
                onSubmit={handlePromptSubmit}
                isEditing={isEditing}
                isLoading={loading}
              />
            </>
          ) : loading ? (
            <div
              role="status"
              className="flex items-center mx-auto justify-center h-56 max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-secondary"
            >
              <ImageIcon className="w-10 h-10 text-gray-200 dark:text-muted-foreground" />
              <span className="pl-4 font-mono text-muted-foreground">
                Processing...
              </span>
            </div>
          ) : (
            <>
              <ImageResultDisplay
                imageUrl={displayImage || ""}
                backstory={backstory}
                petName={petName}
                onReset={handleReset}
                conversationHistory={history}
                onMintNFT={handleMintNFT} 
              />
              <ImagePromptInput
                onSubmit={handlePromptSubmit}
                isEditing={true}
                isLoading={loading}
              />
            </>
          )}
      
    </div>
  </div>
</div>
  )
  }