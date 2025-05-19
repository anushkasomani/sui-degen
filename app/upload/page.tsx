// app/upload/page.tsx
import PinataImageUploader from "../components/PinataImageUploader";

export default function UploadPage() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">IPFS Image Upload</h1>
      <PinataImageUploader />
    </main>
  );
}