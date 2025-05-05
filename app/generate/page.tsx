// "use client";

// import { useState } from "react";
// import { ImageIcon, Wand2 } from "lucide-react";
// import { HistoryItem } from "@/lib/types";
// import { ImageUpload } from "../components/ImageUpload";
// import { ImagePromptInput } from "../components/ImagePromptInput";
// import { ImageResultDisplay } from "../components/ImageResultDisplay";
// import { uploadImageToStoracha } from "../../utils.js";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/card";

// export default function GenerateImage() {
//   const [image, setImage] = useState<string | null>(null);
//   const [generatedImage, setGeneratedImage] = useState<string | null>(null);
//   const [description, setDescription] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [history, setHistory] = useState<HistoryItem[]>([]);
//   const [backstory, setBackstory] = useState<string | null>(null);
//   const [petName, setPetName] = useState<string | null>(null);
//   const [storachaStatus, setStorachaStatus] = useState<string | null>(null);

//   const handleImageSelect = (imageData: string) => {
//     setImage(imageData || null);
//   };

//   const handlePromptSubmit = async (prompt: string, userBackstory: string) => {
//     try {
//       setLoading(true);
//       setError(null);
//       setStorachaStatus(null);

//       const imageToEdit = generatedImage || image;

//       const requestData = {
//         prompt,
//         image: imageToEdit,
//         history: history.length > 0 ? history : undefined,
//         backstory: userBackstory || null,
//       };

//       const response = await fetch("/api/image", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(requestData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to generate image");
//       }

//       const data = await response.json();

//       if (data.image) {
//         setGeneratedImage(data.image);
//         setBackstory(data.backstory || userBackstory || null);
//         setPetName(data.petName || null);

//         const userMessage: HistoryItem = {
//           role: "user",
//           parts: [
//             { text: prompt },
//             ...(imageToEdit ? [{ image: imageToEdit }] : []),
//           ],
//         };

//         const aiResponse: HistoryItem = {
//           role: "model",
//           parts: [
//             ...(data.description ? [{ text: data.description }] : []),
//             ...(data.image ? [{ image: data.image }] : []),
//           ],
//         };

//         const updatedHistory = [...history, userMessage, aiResponse];
//         setHistory(updatedHistory);

//         // Create structured data for Storacha
//         const storachaData = {
//           prompt,
//           generatedImage: data.image,
//           backstory: data.backstory || userBackstory || null,
//           petName: data.petName || null,
//           history: updatedHistory,
//           timestamp: new Date().toISOString(),
//         };

//         // Log the details to console
//         console.log("NFT Pet Generation Details:", storachaData);

//         // Upload to Storacha
//         try {
//           setStorachaStatus("Uploading to decentralized storage...");

//           // Convert the image data URL to a Blob
//           const imageBlob = await fetch(data.image).then((r) => r.blob());

//           // Upload the image to Storacha
//           const imageUploadResult = await uploadImageToStoracha(
//             imageBlob,
//             `pet_nft_${Date.now()}.png`
//           );

//           // Create metadata JSON
//           const metadataBlob = new Blob(
//             [JSON.stringify(storachaData, null, 2)],
//             { type: "application/json" }
//           );

//           // Upload the metadata to Storacha
//           const metadataUploadResult = await uploadImageToStoracha(
//             metadataBlob,
//             `pet_nft_metadata_${Date.now()}.json`
//           );

//           console.log("Image stored on IPFS:", imageUploadResult);
//           console.log("Metadata stored on IPFS:", metadataUploadResult);

//           setStorachaStatus(`Successfully stored on decentralized storage!`);
//         } catch (storageError) {
//           console.error("Failed to store on Storacha:", storageError);
//           setStorachaStatus(`Storage error: ${storageError}`);
//         }
//       } else {
//         setError("No image returned from API");
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An error occurred");
//       console.error("Error processing request:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReset = () => {
//     setImage(null);
//     setGeneratedImage(null);
//     setDescription(null);
//     setLoading(false);
//     setError(null);
//     setHistory([]);
//     setStorachaStatus(null);
//   };

//   const currentImage = generatedImage || image;
//   const isEditing = !!currentImage;
//   const displayImage = generatedImage;

//   return (
//     <main className="min-h-screen flex items-center justify-center bg-background p-2 font-sans">
//       <Card className="w-full max-w-4xl border-0 bg-card shadow-none">
//         <CardHeader className="flex flex-col items-center space-y-2">
//           <CardTitle className="flex items-center gap-2 text-foreground">
//             <Wand2 className="w-8 h-8 text-primary" />
//             Create Your Own NFT Pet
//           </CardTitle>
//         </CardHeader>

//         <CardContent className="space-y-6 pt-6 w-full">
//           {error && (
//             <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
//               {error}
//             </div>
//           )}

//           {storachaStatus && (
//             <div
//               className={`p-4 mb-4 text-sm rounded-lg ${
//                 storachaStatus.includes("error")
//                   ? "text-amber-700 bg-amber-100"
//                   : storachaStatus.includes("Success")
//                   ? "text-green-700 bg-green-100"
//                   : "text-blue-700 bg-blue-100"
//               }`}
//             >
//               {storachaStatus}
//             </div>
//           )}

//           {!displayImage && !loading ? (
//             <>
//               <ImageUpload
//                 onImageSelect={handleImageSelect}
//                 currentImage={currentImage}
//               />
//               <ImagePromptInput
//                 onSubmit={handlePromptSubmit}
//                 isEditing={isEditing}
//                 isLoading={loading}
//               />
//             </>
//           ) : loading ? (
//             <div
//               role="status"
//               className="flex items-center mx-auto justify-center h-56 max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-secondary"
//             >
//               <ImageIcon className="w-10 h-10 text-gray-200 dark:text-muted-foreground" />
//               <span className="pl-4 font-mono text-muted-foreground">
//                 Processing...
//               </span>
//             </div>
//           ) : (
//             <>
//               <ImageResultDisplay
//                 imageUrl={displayImage || ""}
//                 backstory={backstory}
//                 petName={petName}
//                 onReset={handleReset}
//                 conversationHistory={history}
//                 // storachaStatus={storachaStatus}
//               />
//               <ImagePromptInput
//                 onSubmit={handlePromptSubmit}
//                 isEditing={true}
//                 isLoading={loading}
//               />
//             </>
//           )}
//         </CardContent>
//       </Card>
//     </main>
//   );
// }
"use client";

import { useState } from "react";
import { ImageIcon, Wand2 } from "lucide-react";
import { HistoryItem } from "@/lib/types";
import { ImageUpload } from "../components/ImageUpload";
import { ImagePromptInput } from "../components/ImagePromptInput";
import { ImageResultDisplay } from "../components/ImageResultDisplay";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
const host = "http://localhost:10000";
// Backend service URL
const UPLOAD_SERVICE_URL = host || "https://your-render-service.onrender.com";

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

  const handleImageSelect = (imageData: string) => {
    setImage(imageData || null);
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

  const handlePromptSubmit = async (prompt: string, userBackstory: string) => {
    try {
      setLoading(true);
      setError(null);
      setStorageStatus(null);

      const imageToEdit = generatedImage || image;

      const requestData = {
        prompt,
        image: imageToEdit,
        history: history.length > 0 ? history : undefined,
        backstory: userBackstory || null,
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

        // Create structured metadata for storage
        const metadata = {
          prompt,
          petName: data.petName || null,
          backstory: data.backstory || userBackstory || null,
          timestamp: new Date().toISOString(),
          history: updatedHistory,
        };

        // Store the generated image and metadata
        try {
          setStorageStatus("Storing to decentralized storage...");

          // Upload the generated image
          const imageUploadResult = await uploadImageToBackend(
            data.image,
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

          setStorageStatus("Successfully stored to decentralized storage!");
        } catch (storageError) {
          console.error("Storage error:", storageError);
          setStorageStatus(`Storage error: ${storageError}`);
        }
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

  const handleReset = () => {
    setImage(null);
    setGeneratedImage(null);
    setDescription(null);
    setLoading(false);
    setError(null);
    setHistory([]);
    setStorageStatus(null);
  };

  const currentImage = generatedImage || image;
  const isEditing = !!currentImage;
  const displayImage = generatedImage;

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-2 font-sans">
      <Card className="w-full max-w-4xl border-0 bg-card shadow-none">
        <CardHeader className="flex flex-col items-center space-y-2">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Wand2 className="w-8 h-8 text-primary" />
            Create Your Own NFT Pet
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 pt-6 w-full">
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
              <ImageUpload
                onImageSelect={handleImageSelect}
                currentImage={currentImage}
              />
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
                // storageStatus={storageStatus}
              />
              <ImagePromptInput
                onSubmit={handlePromptSubmit}
                isEditing={true}
                isLoading={loading}
              />
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
