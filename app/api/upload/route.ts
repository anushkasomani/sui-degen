// app/api/upload/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { PinataSDK } from "pinata";

// Initialize Pinata SDK with server-side credentials
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL
});

export async function POST(request: NextRequest) {
  try {
    // Parse the form data from the request
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Get metadata if provided
    const name = data.get("name") as string || file.name;
    const description = data.get("description") as string || "";

    // Upload the file to Pinata
    const uploadResult = await pinata.upload.public
      .file(file)
      .name(name)
      .keyvalues({
        description: description,
        uploadedAt: new Date().toISOString()
      });

    // Get a gateway URL for the uploaded file
    const url = await pinata.gateways.public.convert(uploadResult.cid);

    // Return the upload result with the URL
    return NextResponse.json({
      success: true,
      cid: uploadResult.cid,
      name: uploadResult.name,
      url: url
    }, { status: 200 });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file to IPFS" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false, // Disabling body parser as we're using formData
  },
};