// storachaImageUploader.js

import { create } from "@web3-storage/w3up-client";
import { StoreMemory } from "@web3-storage/w3up-client/stores/memory";

/**
 * Uploads an image to Storacha using a default space
 * @param {File|Blob} imageFile - The image file to upload
 * @param {string} [filename] - Optional custom filename (defaults to timestamped name)
 * @param {string} [defaultSpaceDid] - Optional space DID (uses first available space if not provided)
 * @param {string} [email] - Email for authentication (defaults to "avularamswaroop@gmail.com")
 * @returns {Promise<{cid: string, url: string}>} The CID and gateway URL of the uploaded image
 */
export const uploadImageToStoracha = async (
  imageFile,
  filename = null,
  defaultSpaceDid = "z6MkwJVJeZ9WMRUmQaT9rBxHVxvQ8RCQGAgvrRJnY5swMb5f",
  email = "avularamswaroop@gmail.com"
) => {
  // Validate input
  if (!imageFile) {
    throw new Error("No image file provided");
  }

  // Create a unique filename if not provided
  const actualFilename =
    filename ||
    `image_${Date.now()}.${imageFile.name?.split(".").pop() || "png"}`;

  try {
    // Create client with memory store
    const store = new StoreMemory();
    const client = await create({ store });

    // Login with email
    await client.login(email);

    // Try to claim delegations (helps with authorization)
    try {
      await client.capability.access.claim();
    } catch (claimError) {
      console.warn("Delegation claim warning (continuing):", claimError);
    }

    // Get available spaces
    const spaces = await client.spaces();

    if (spaces.length === 0) {
      throw new Error("No spaces available for upload");
    }

    // Determine which space to use
    let targetSpace;

    if (defaultSpaceDid) {
      // Try to find the specified space
      targetSpace = spaces.find((space) => space.did() === defaultSpaceDid);
      if (!targetSpace) {
        console.warn(
          `Specified space DID not found, using first available space`
        );
        targetSpace = spaces[0];
      }
    } else {
      // Use the first available space
      targetSpace = spaces[0];
    }

    // Set the current space
    await client.setCurrentSpace(targetSpace.did());

    // Prepare the file for upload
    const file = new File([imageFile], actualFilename, {
      type: imageFile.type || "image/png",
    });

    // Upload the file
    const cid = await client.uploadFile(file);

    // Return the CID and gateway URL
    return {
      cid: cid.toString(),
      url: `https://${cid.toString()}.ipfs.w3s.link`,
      filename: actualFilename,
      spaceDid: targetSpace.did(),
    };
  } catch (error) {
    console.error("Error uploading image to Storacha:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

/**
 * Retrieves an image from Storacha by CID
 * @param {string} cid - The CID of the image to retrieve
 * @returns {Promise<string>} The URL of the retrieved image
 */
export const getImageFromStoracha = (cid) => {
  if (!cid) {
    throw new Error("No CID provided");
  }

  return `https://${cid}.ipfs.w3s.link`;
};
