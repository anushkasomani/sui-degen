'use client'
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useState, useEffect } from "react";
import { useAccounts } from "@mysten/dapp-kit";
import { NFT_Collection_ID,package_id,global_id } from "../utils/constants";
import toast from "react-hot-toast";

export default function NFTCard({ nft }) {
  // const [acc, setacc] = useState<string | null>(null)
  // const accounts= useAccounts();
  // useEffect(()=>{
  //   if (accounts[0]) {
  //     setacc(accounts[0].address);
  //   }
  //   console.log("connected acc",accounts[0].address)
  // }, [accounts]);
  
  const client = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  
  const { data, isPending, error, refetch } = useSuiClientQuery("getObject", {
    id: nft.id,
    options: {
      showContent: true,
      showOwner: true,
    },
  });

  const [counter, setCounter] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");

  // Determine if evolve button should be enabled
  const isEvolveEnabled = nft.points >= 15 * nft.level;

  const openEvolveModal = () => {
    if (isEvolveEnabled) {
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    // setNewImageUrl("");
  };

  const handleBackstory=async () => {
    try {
       const wantsToUpdateBackstory = window.confirm(
      "Do you want to update the backstory?"
       );
       let finalBackstory = nft.lore;
       if (wantsToUpdateBackstory) {
      const prompt = window.prompt(
        "How should the backstory evolve?",
        "E.g., Bloop found a mysterious portal to Meme Mountain..."
      );

      if (prompt) {
        const response = await fetch("/api/generate-backstory", {
          method: "POST",
          headers: {
         "Content-Type": "application/json",
          },
          body: JSON.stringify({
         originalBackstory: nft.lore,
         prompt: prompt,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          finalBackstory = data.modifiedBackstory;
          console.log(finalBackstory)
          const tx = new Transaction();
          tx.moveCall({
         target: `${package_id}::tailz::update_backstory`,
         arguments: [
           tx.object(nft.id),
           tx.pure.string(finalBackstory),
           tx.pure.address(currentAccount?.address ?? "")
         ]
          });
          signAndExecute(
         {
           transaction: tx
         },
         {
           onSuccess: () => {
          toast("NFT Evolved Succesfully");
           }
         }
          );
        } else {
          throw new Error("Backstory generation failed");
        }
      }
       } else {
      return;
       }
     } catch (error) {
       console.error(error);
       toast.error("An error occurred while updating the backstory.");
     }
  };
  const handleEvolveWithoutChanges = async () => {
    // e.preventDefault();
    // if (!newImageUrl) return;

    const tx = new Transaction();

    tx.moveCall({
      target: `${package_id}::tailz::level_up_without_changes`,
      arguments: [
        tx.object(NFT_Collection_ID), // &mut NFTCollection
        tx.pure.u64(nft.nft_id), // nft_id as u64
        // new_url as String
      ],
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: async ({ digest }) => {
          const { effects } = await client.waitForTransaction({
            digest: digest,
            options: {
              showEffects: true,
            },
          });

          console.log(effects);
          handleBackstory();
        },
      }
    );
  };

  const handleFeed = async () => {
    
    // e.preventDefault();
    // if (!newImageUrl) return;
  //    const { data: coins } = await client.getCoins({
  //   owner: acc,
  //   coinType: '0x2::sui::SUI'
  // });

  // 4. Select coin with ≥0.06 SUI or largest available
  // const requiredAmount = 50_000_000; // 0.06 SUI (buffer)
  // let paymentCoinId = coins.find(c => 
  //   BigInt(c.balance) >= BigInt(requiredAmount)
  // )?.coinObjectId;

  // 5. If no adequate coin, use largest one
  // if (!paymentCoinId) {
  //   const largestCoin = coins.reduce((a, b) => 
  //     BigInt(a.balance) > BigInt(b.balance) ? a : b
  //   );
  //   paymentCoinId = largestCoin.coinObjectId;
  // }
  //    const tx = new Transaction();

  // // Split exact 0.05 SUI if needed
  // const [paymentCoin] = tx.splitCoins(
  //   tx.object(paymentCoinId),
  //   [tx.pure.u64(50_000_000)] // 0.05 SUI
  // );
 const tx = new Transaction();

// Split proper amount (0.05 SUI)
const [coins] = tx.splitCoins(tx.gas, [tx.pure.u64(50_000_000)]);

// Feed call
tx.moveCall({
  target: `${package_id}::tailz::feed`,
  arguments: [
    tx.object(NFT_Collection_ID),
    tx.pure.u64(nft.nft_id),
    coins,
    tx.object(global_id)
  ],
});

// Set proper gas budget
tx.setGasBudget(200_000_000);
    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: async ({ digest }) => {
          const { effects } = await client.waitForTransaction({
            digest: digest,
            options: {
              showEffects: true,
            },
          });

          console.log(effects);
        },
      }
    );
  };

  const handleTrain = async () => {
   const tx = new Transaction();

// Split proper amount (0.05 SUI)
const [coins] = tx.splitCoins(tx.gas, [tx.pure.u64(50_000_000)]);

// Feed call
tx.moveCall({
  target: `${package_id}::tailz::feed`,
  arguments: [
    tx.object(NFT_Collection_ID),
    tx.pure.u64(nft.nft_id),
    coins,
    tx.object(global_id)
  ],
});

// Set proper gas budget
tx.setGasBudget(200_000_000);
    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: async ({ digest }) => {
          const { effects } = await client.waitForTransaction({
            digest: digest,
            options: {
              showEffects: true,
            },
          });

          console.log(effects);
        },
      }
    );
  };

  const handleEvolveWithChanges = async () => {
    // e.preventDefault();
    if (!newImageUrl) return;

    const tx = new Transaction();

    tx.moveCall({
      target: `${package_id}::tailz::level_up_with_changes`,
      arguments: [
        tx.object(NFT_Collection_ID), // &mut NFTCollection
        tx.pure.u64(nft.nft_id), // nft_id as u64
        tx.pure.string(newImageUrl), // new_url as String
      ],
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: async ({ digest }) => {
          const { effects } = await client.waitForTransaction({
            digest: digest,
            options: {
              showEffects: true,
            },
          });

          console.log(effects);
        },
      }
    );

    closeModal();
  };

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      
      <div className="w-full h-100 p-3">
        <img
          src={nft.image_url}
          alt="NFT"
          className="w-[100%] h-full object-cover"
          onError={(e) =>
            (e.currentTarget.src = "https://via.placeholder.com/150")
          }
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-700">
            Points: {counter}
          </span>
          <button
            onClick={() => setCounter(counter + 1)}
            className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded transition-colors"
          >
            Increment
          </button>
        </div>
        <div className="mt-2 pt-2 border-t">
          <p className="font-mono">Level:</p>
          <p className="text-xs text-gray-500 break-all font-mono bg-gray-50 p-1.5 rounded">
            {nft.level}
          </p>
          <p className="font-mono">Multiplier:</p>
          <p className="text-xs text-gray-500 break-all font-mono bg-gray-50 p-1.5 rounded mb-2">
            {nft.multiplier / 1000}
          </p>
          <p className="font-mono">Happiness:</p>
          <p className="text-xs text-gray-500 break-all font-mono bg-gray-50 p-1.5 rounded mb-2">
            {nft.happiness}
          </p>
          <p className="font-mono">Power:</p>
          <p className="text-xs text-gray-500 break-all font-mono bg-gray-50 p-1.5 rounded mb-2">
            {nft.power}
          </p>
          <p className="font-mono">Points:</p>
          <p className="text-xs text-gray-500 break-all font-mono bg-gray-50 p-1.5 rounded mb-2">
            {nft.points}
          </p>
          <p className="font-mono">Owner:</p>
          <p className="text-xs text-gray-500 break-all font-mono bg-gray-50 p-1.5 rounded mb-2">
            {nft.owner}
          </p>

          <p className="font-mono">NFT ID:</p>
          <p className="text-xs text-gray-500 break-all font-mono bg-gray-50 p-1.5 rounded mb-2">
            {/* <Link
              to={`https://suiscan.xyz/testnet/object/${nft.id}/fields`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 break-all"
            >
              {nft.id}
            </Link> */}
          </p>
          <p className="font-mono">IPFS Link:</p>
          <p className="text-xs text-gray-500 break-all font-mono bg-gray-50 p-1.5 rounded">
            {/* <Link
              to={`${nft.image_url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 break-all"
            >
              {nft.image_url}
            </Link> */}
          </p>
        </div>

        <div className="mt-3 pt-3 border-t">
          <button
            onClick={handleFeed}
            className="w-full bg-green-700 hover:bg-green-800
                text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clipRule="evenodd"
              />
            </svg>
            Feed
          </button>
        </div>

        <div className="mt-3 pt-3 border-t">
          <button
            onClick={handleTrain}
            className="w-full bg-red-700 hover:bg-red-800
                text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clipRule="evenodd"
              />
            </svg>
            Train
          </button>
        </div>

        <div className="mt-3 pt-3 border-t">
          <button
            onClick={handleEvolveWithoutChanges}
            disabled={!isEvolveEnabled}
            className={`w-full ${
              isEvolveEnabled
                ? "bg-purple-700 hover:bg-purple-800"
                : "bg-purple-400 cursor-not-allowed"
            } text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clipRule="evenodd"
              />
            </svg>
            Evolve NFT (No Change)
          </button>
        </div>

        <div className="mt-3 pt-3 border-t">
          <button
            onClick={openEvolveModal}
            disabled={!isEvolveEnabled}
            className={`w-full ${
              isEvolveEnabled
                ? "bg-purple-700 hover:bg-purple-800"
                : "bg-purple-400 cursor-not-allowed"
            } text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clipRule="evenodd"
              />
            </svg>
            Evolve NFT
          </button>
        </div>
      </div>

      {/* Modal for evolving NFT */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Evolve Your NFT
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Enter a new image URL to evolve your NFT to the next level.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Image URL
              </label>
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter new image URL (e.g. IPFS link)"
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleEvolveWithChanges()}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                disabled={!newImageUrl}
              >
                Evolve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}