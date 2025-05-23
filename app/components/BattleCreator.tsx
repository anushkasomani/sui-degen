"use client";
import { useState } from "react";
import { Transaction } from "@mysten/sui/transactions";
import {
  useSignAndExecuteTransaction,
  useSuiClient,
  ConnectButton,
} from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface Pet {
  id: string;
  image_url: string;
  level: number;
  nft_id: number;
  owner: string;
  happiness: number;
  power: number;
  multiplier: number;
  points: number;
}

interface BattleCreatorProps {
  onBattleCreated: () => void;
}

const NFT_Collection_ID =
  "0xc03ee66d6922dcb94a79c1f8fb9252575044e117106219b725a3d4e032bce40b";
const packageId =
  "0x58ef067daa0ad013898fb0a8c05cab46820c6521bfc0ec5570c20747d55d3d12";
const battleCollectionId =
  "0xd848c8b40736f054f1834ac5d13699967989ae47e9a1f54338598e1fb8833466";

export default function BattleCreator({ onBattleCreated }: BattleCreatorProps) {
  const client = useSuiClient();
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();

  const [selectedPet1, setSelectedPet1] = useState<Pet | null>(null);
  const [selectedPet2, setSelectedPet2] = useState<Pet | null>(null);
  const [battleDuration, setBattleDuration] = useState<number>(300); // 5 minutes default

  // Fetch all pets from collection
  const { data: pets } = useQuery({
    queryKey: ["all-pets"],
    queryFn: async () => {
      const collection = await client.getObject({
        id: NFT_Collection_ID,
        options: { showContent: true },
      });

      const nftsTableId =
        collection.data?.content?.fields?.nfts?.fields?.id?.id;
      const nfts = await client.getDynamicFields({ parentId: nftsTableId });

      return Promise.all(
        nfts.data.map(async (nft) => {
          const nftData = await client.getObject({
            id: nft.objectId,
            options: { showContent: true },
          });

          const fields = nftData.data?.content?.fields;
          return {
            id: nftData.data?.objectId,
            image_url: fields?.image_url,
            level: fields?.level,
            nft_id: fields?.nft_id,
            owner: fields?.owner,
            happiness: fields?.happiness,
            power: fields?.power,
            multiplier: fields?.multiplier,
            points: fields?.points,
          } as Pet;
        })
      );
    },
  });

  const calculatePetScore = (pet: Pet) => {
    return (pet.happiness + pet.power) * pet.multiplier;
  };

  const createBattle = async () => {
    if (!selectedPet1 || !selectedPet2) {
      toast.error("Please select two pets for battle");
      return;
    }

    if (selectedPet1.nft_id === selectedPet2.nft_id) {
      toast.error("Cannot battle the same pet against itself");
      return;
    }

    try {
      const tx = new Transaction();

      // Convert pet IDs to u256 format
      const pet1Id = BigInt(selectedPet1.nft_id);
      const pet2Id = BigInt(selectedPet2.nft_id);
      /*
  tx.moveCall({
    target: `${packageId}::tailz::create_battle`,
    arguments: [
      tx.object(battleCollectionId), // BattleCollection object
      tx.pure.u256(pet1Id),             // DynamicNFT object 1
      tx.pure.u256(pet2Id)              // DynamicNFT object 2
    ]
  });
*/
      tx.moveCall({
        target: `${packageId}::tailz::create_battle`,
        arguments: [
          tx.object(battleCollectionId),
          tx.pure.u256(pet1Id),
          tx.pure.u256(pet2Id),
        ],
      });

      tx.setGasBudget(300_000_000);

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: async ({ digest }) => {
            toast.success("Battle created successfully!");
            console.log("Battle created with digest:", digest);
            onBattleCreated();

            // Reset selections
            setSelectedPet1(null);
            setSelectedPet2(null);
          },
          onError: (error) => {
            toast.error("Failed to create battle");
            console.error("Battle creation error:", error);
          },
        }
      );
    } catch (error) {
      toast.error("Error creating battle");
      console.error("Battle creation error:", error);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg mb-6 border border-gray-200">
      {/* Connect Wallet at Top */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-pixelify text-gray-800">
          Create New Battle
        </h2>
        <div className="font-pixelify">
          <ConnectButton />
        </div>
      </div>

      {/* Battle Duration Selector */}
      <div className="mb-6">
        <label className="block text-sm font-bold mb-2 text-gray-800">
          Battle Duration (seconds):
        </label>
        <select
          value={battleDuration}
          onChange={(e) => setBattleDuration(Number(e.target.value))}
          className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-800 font-medium bg-white focus:border-blue-500 focus:outline-none"
        >
          <option value={60}>1 Minute</option>
          <option value={300}>5 Minutes</option>
          <option value={600}>10 Minutes</option>
          <option value={1800}>30 Minutes</option>
          <option value={3600}>1 Hour</option>
        </select>
      </div>

      {/* Pet Selection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
        {/* Pet 1 Selection */}
        <div className="bg-blue-50/80 p-4 rounded-lg border-2 border-blue-200">
          <h3 className="text-lg font-bold mb-3 text-blue-800 text-center">
            Select Pet 1
          </h3>
          {selectedPet1 && (
            <div className="mb-4 p-4 border-2 border-blue-500 rounded-lg bg-white">
              <img
                src={selectedPet1.image_url}
                alt="Pet 1"
                className="w-24 h-24 object-cover rounded-lg mx-auto mb-3"
              />
              <div className="text-center space-y-1">
                <p className="font-bold text-gray-800">
                  ID: {selectedPet1.nft_id}
                </p>
                <p className="font-medium text-gray-700">
                  Level: {selectedPet1.level}
                </p>
                <p className="font-medium text-blue-600">
                  Score: {calculatePetScore(selectedPet1)}
                </p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto bg-white/50 p-2 rounded-lg">
            {pets?.map((pet) => (
              <div
                key={pet.id}
                onClick={() => setSelectedPet1(pet)}
                className={`cursor-pointer p-3 border-2 rounded-lg hover:shadow-md transition-all ${
                  selectedPet1?.id === pet.id
                    ? "border-blue-500 bg-blue-100 shadow-md"
                    : "border-gray-300 bg-white hover:border-blue-300"
                }`}
              >
                <img
                  src={pet.image_url}
                  alt={`Pet ${pet.nft_id}`}
                  className="w-full h-16 object-cover rounded mb-2"
                />
                <p className="text-xs font-bold text-gray-800">
                  ID: {pet.nft_id}
                </p>
                <p className="text-xs font-medium text-gray-600">
                  Lvl: {pet.level}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pet 2 Selection */}
        <div className="bg-red-50/80 p-4 rounded-lg border-2 border-red-200">
          <h3 className="text-lg font-bold mb-3 text-red-800 text-center">
            Select Pet 2
          </h3>
          {selectedPet2 && (
            <div className="mb-4 p-4 border-2 border-red-500 rounded-lg bg-white">
              <img
                src={selectedPet2.image_url}
                alt="Pet 2"
                className="w-24 h-24 object-cover rounded-lg mx-auto mb-3"
              />
              <div className="text-center space-y-1">
                <p className="font-bold text-gray-800">
                  ID: {selectedPet2.nft_id}
                </p>
                <p className="font-medium text-gray-700">
                  Level: {selectedPet2.level}
                </p>
                <p className="font-medium text-red-600">
                  Score: {calculatePetScore(selectedPet2)}
                </p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto bg-white/50 p-2 rounded-lg">
            {pets?.map((pet) => (
              <div
                key={pet.id}
                onClick={() => setSelectedPet2(pet)}
                className={`cursor-pointer p-3 border-2 rounded-lg hover:shadow-md transition-all ${
                  selectedPet2?.id === pet.id
                    ? "border-red-500 bg-red-100 shadow-md"
                    : "border-gray-300 bg-white hover:border-red-300"
                }`}
              >
                <img
                  src={pet.image_url}
                  alt={`Pet ${pet.nft_id}`}
                  className="w-full h-16 object-cover rounded mb-2"
                />
                <p className="text-xs font-bold text-gray-800">
                  ID: {pet.nft_id}
                </p>
                <p className="text-xs font-medium text-gray-600">
                  Lvl: {pet.level}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* VS Indicator */}
      {selectedPet1 && selectedPet2 && (
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-blue-500 to-red-500 text-white px-6 py-3 rounded-full font-bold text-lg">
            <span>Pet {selectedPet1.nft_id}</span>
            <span className="text-2xl">⚔️</span>
            <span>Pet {selectedPet2.nft_id}</span>
          </div>
        </div>
      )}

      {/* Create Battle Button */}
      <button
        onClick={createBattle}
        disabled={!selectedPet1 || !selectedPet2 || isPending}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-lg font-pixelify text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed"
      >
        {isPending ? "⚔️ Creating Battle..." : "🚀 Create Battle"}
      </button>
    </div>
  );
}
