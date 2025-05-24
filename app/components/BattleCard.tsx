"use client";
import { useState, useEffect } from "react";
import { useCountdown } from "../hooks/useCountdown";
import { useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import {global_id, NFT_Collection_ID, tailzType, battleCollectionId, package_id} from "../utils/constants";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useAccounts } from "@mysten/dapp-kit";
import toast from "react-hot-toast";

interface StakeInfo {
  fields: {
    id: { id: string };
    stakers_pet1: string[];
    stakers_pet2: string[];
    stakes_pet1: {
      type: string;
      // ObjectTable data
    };
    stakes_pet2: {
      type: string;
      // ObjectTable data
    };
  };
  type: string;
}

interface Battle {
  id: string;
  battle_id: number;
  pet1: string;
  pet2: string;
  stake_total_pet1: number;
  stake_total_pet2: number;
  creator: string;
  is_active: boolean;
  created_at: number;
  stake_info: StakeInfo;  // Now properly typed
  // duration: number;
}


interface Pet {
  pet_name: string;
  nft_id: number;
  image_url: string;
  backstory: string,
  level: number;
  happiness: number;
  power: number;
  multiplier: number;
}

interface BattleCardProps {
  battle: Battle;
  onBattleEnd: (battleId: string, winner: number) => void;
}



export default function BattleCard({ battle, onBattleEnd }: BattleCardProps) {
  
  const connectedAddress= useAccounts();
  const address= connectedAddress[0];
  const client = useSuiClient();
   const { mutate: signAndExecute, isPending: isMinting } =
    useSignAndExecuteTransaction();
  const [pet1Data, setPet1Data] = useState<Pet | null>(null);
  const [pet2Data, setPet2Data] = useState<Pet | null>(null);
  const [winner, setWinner] = useState<number | null>(null);
   const targetT= new Date(Number(battle.created_at)+ 5*60*60*1000)
   
const [days, hours, minutes, seconds] = useCountdown(targetT);
const safeDays = Math.max(0, days || 0);
const safeHours = Math.max(0, hours || 0);
const safeMinutes = Math.max(0, minutes || 0);
const safeSeconds = Math.max(0, seconds || 0);

  useEffect(() => {
    fetchPetData();
    console.log(battle)
  }, [battle.pet1, battle.pet2]);

  const fetchPetData = async () => {
    try {
      const collection = await client.getObject({
        id: NFT_Collection_ID,
        options: { showContent: true },
      });

      const nftsTableId =
        collection.data?.content?.fields?.nfts?.fields?.id?.id;
      const nfts = await client.getDynamicFields({ parentId: nftsTableId });
      console.log(battle.pet1)
      const pet1Id = battle.pet1;
      const pet2Id = battle.pet2;
     
      for (const nft of nfts.data) {
        const nftData = await client.getObject({
          id: nft.objectId,
          options: { showContent: true },
        });

        const fields = nftData.data?.content?.fields;
        const nftId = fields?.objectId;

        if (nft.objectId === pet1Id) {
          setPet1Data({
            nft_id: fields?.nft_id,
            pet_name:fields?.name,
            image_url: fields?.image_url,
            backstory: fields?.backstory,
            level: fields?.level,
            happiness: fields?.happiness,
            power: fields?.power,
            multiplier: fields?.multiplier,
          });
        }

        if (nft.objectId === pet2Id) {
          setPet2Data({
            nft_id: fields?.nft_id,
            pet_name:fields?.name,
            image_url: fields?.image_url,
            backstory: fields?.backstory,
            level: fields?.level,
            happiness: fields?.happiness,
            power: fields?.power,
            multiplier: fields?.multiplier,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching pet data:", error);
    }
  };

  const calculatePetScore = (pet: Pet) => {
    return (pet.happiness + pet.power) * pet.multiplier;
  };


  const handleRewards = async (battle: Battle, winnerPet: number) => {
  try {
    // Validate inputs
    if (!battle || !battle.stake_info?.fields) {
      console.error('Invalid battle object');
      return;
    }
    
    if (winnerPet !== 1 && winnerPet !== 2) {
      console.error('Winner pet must be 1 or 2');
      return;
    }
    
    const tx = new Transaction();
    
    // Get stakers arrays from stake_info.fields
    const stakersWinner = winnerPet === 1 
      ? battle.stake_info.fields.stakers_pet1 
      : battle.stake_info.fields.stakers_pet2;
      
    const stakersLoser = winnerPet === 1 
      ? battle.stake_info.fields.stakers_pet2 
      : battle.stake_info.fields.stakers_pet1;
    
    console.log('Winner stakers:', stakersWinner);
    console.log('Loser stakers:', stakersLoser);
    
    // Check if there are any stakers to process
    if ((!stakersWinner || stakersWinner.length === 0) && 
        (!stakersLoser || stakersLoser.length === 0)) {
      console.log('No stakers to process');
      return;
    }
    
    // Process winner stakers - they get their stakes back
    if (stakersWinner && stakersWinner.length > 0) {
      for (const stakerAddr of stakersWinner) {
        if (winnerPet === 1) {
          tx.moveCall({
            target: `${package_id}::tailz::withdraw_stake_pet1`,
            arguments: [
              tx.object(battleCollectionId),
              tx.pure.u64(battle.battle_id),
              tx.pure.address(stakerAddr),
            ],
          });
        } else {
          tx.moveCall({
            target: `${package_id}::tailz::withdraw_stake_pet2`,
            arguments: [
              tx.object(battleCollectionId),
              tx.pure.u64(battle.battle_id),
              tx.pure.address(stakerAddr),
            ],
          });
        }
      }
    }
    
    // Process loser stakers - their stakes go to global owner
    if (stakersLoser && stakersLoser.length > 0) {
      for (const stakerAddr of stakersLoser) {
        tx.moveCall({
          target: `${package_id}::tailz::withdraw_stake_to_global_owner`,
          arguments: [
            tx.object(battleCollectionId),
            tx.pure.u64(battle.battle_id),
            tx.pure.address(stakerAddr),
            tx.object(global_id),
          ],
        });
      }
    }
    
    // Execute all transactions in one block - no return value
    await signAndExecute(
      { transaction: tx },
      {
        onSuccess: (result) => {
          console.log('All rewards processed successfully');
          console.log(`Winners processed: ${stakersWinner?.length || 0}`);
          console.log(`Losers processed: ${stakersLoser?.length || 0}`);
        },
        onError: (error) => {
          console.error('Error processing rewards:', error);
        }
      }
    );
    
  } catch (error) {
    console.error('Error in handleRewards:', error);
  }
};

  const handleStake = async (petNumber: number) => {
    console.log(address?.address)
    const coins = await client.getCoins({
  owner: address?.address,
  coinType: tailzType,
});

console.log('Your TAILZ coin object IDs:', coins.data.map(c => c.coinObjectId));

if (!coins.data || coins.data.length === 0) {
  throw new Error("No TAILZ coins found in your wallet");
}
const paymentCoinObjectId = coins.data[0].coinObjectId;
const tx = new Transaction();
const [stakeCoin] = tx.splitCoins(
  tx.object(coins.data[0].coinObjectId), 
  [tx.pure.u64(5_000_000)]
);

 tx.moveCall({
      target: `${package_id}::tailz::stake`,
      
      arguments: [
        tx.object(battleCollectionId),
        tx.pure.u64(battle.battle_id),
        tx.pure.u8(petNumber),
        stakeCoin,
      ],
    });

    tx.setGasBudget(300_000_000);
signAndExecute(
  {
    transaction: tx,
  },
  {
    onSuccess: async ({ digest }) => {
      const { effects } = await client.waitForTransaction({
        digest,
        options: {
          showEffects: true,
        },
      });
    },
  }
);
  }

const handleDeclareWinner = async () => {
 
  let winnerPetIndex = 0;
  let winnerPetId: string | undefined;
  if (battle.stake_total_pet1 > battle.stake_total_pet2) {
    winnerPetIndex = 1;
    winnerPetId = battle.pet1;
  } else if (battle.stake_total_pet1 < battle.stake_total_pet2) {
    winnerPetIndex = 2;
    winnerPetId = battle.pet2;
  } else {
    console.log("oops, looks like we have tie in term of stakes. Let's see who's got it better socially");
    return; // Prevent further execution if tie
  }

  if (winnerPetId === undefined) {
    toast.error("Winner Pet ID is undefined!");
    return;
  }

  const tx = new Transaction();
  tx.moveCall({
    target: `${package_id}::tailz::declare_winner`,
    arguments: [
      tx.object(battleCollectionId),
      tx.pure.u64(winnerPetIndex),
      tx.pure.string(winnerPetId),
      tx.object(global_id)
    ]
  });
  signAndExecute(
    {
      transaction: tx,
    },
    {
      onSuccess: async ({ digest }) => {
        const { effects } = await client.waitForTransaction({
          digest,
          options: {
            showEffects: true,
          },
        });
        toast(
          `Yay! Pet ${winnerPetIndex} is the winner.
        Wait for sometime to see the rewards in your account`
        );
        handleRewards(battle,winnerPetIndex)
        
      },
    }
  );
};


  

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border-2 border-gray-200 font-courier-prime">
     
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold font-pixelify text-gray-800">
          Battle #{battle.battle_id}
        </h3>
        <div className="flex items-center space-x-3">
          <span
            className={`px-4 py-2 rounded-full text-sm font-bold ${
              battle.is_active 
                ? "bg-green-100 text-green-800 border-2 border-green-300"
                : "bg-red-100 text-red-800 border-2 border-red-300"
            }`}
          >
            {battle.is_active? "🔥 Active" : "⏹️ Ended"}
          </span>
        </div>
      </div>

{battle.is_active && (
  <div className="text-center mb-6">
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
      <h4 className="text-lg font-bold mb-3 font-pixelify">
        ⏰ Time Remaining
      </h4>
      <div className="flex justify-center items-center space-x-3 text-3xl font-bold font-mono">
        {safeDays > 0 && (
  <>
    <div className="bg-white/20 rounded-lg px-3 py-2">
      <span className="text-white">{String(safeDays).padStart(2, '0')}</span>
      <div className="text-xs text-white/80">DAYS</div>
    </div>
    <span className="text-white/60">:</span>
  </>
)}
<div className="bg-white/20 rounded-lg px-3 py-2">
  <span className="text-white">{String(safeHours).padStart(2, '0')}</span>
  <div className="text-xs text-white/80">HRS</div>
</div>
<span className="text-white/60">:</span>
<div className="bg-white/20 rounded-lg px-3 py-2">
  <span className="text-white">{String(safeMinutes).padStart(2, '0')}</span>
  <div className="text-xs text-white/80">MIN</div>
</div>
<span className="text-white/60">:</span>
<div className="bg-white/20 rounded-lg px-3 py-2">
  <span className="text-white">{String(safeSeconds).padStart(2, '0')}</span>
  <div className="text-xs text-white/80">SEC</div>
</div>
      </div>
    </div>
  </div>
)}
      {/* Pet Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pet 1 */}
        <div
          className={`border-3 rounded-xl p-6 transition-all duration-300 ${
            winner === 1
              ? "border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-lg transform scale-105"
              : "border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100"
          }`}
        >
          <h4 className="text-center font-bold mb-4 text-blue-700 text-lg font-pixelify">
            🔵 Pet 1
          </h4>
          
          {pet1Data ? (
            <>
              <div className="text-center mb-4">
                <img
                  src={pet1Data.image_url}
                  alt={`Pet ${pet1Data.nft_id}`}
                  className="w-32 h-32 object-cover rounded-xl mx-auto shadow-md border-2 border-blue-300"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-pet.png"; // Fallback image
                  }}
                />
              </div>
              <div className="space-y-2 text-sm font-medium text-gray-800">
                <div className="flex justify-between">
                  <span className="font-bold">ID:</span>
                  <span>{pet1Data.nft_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Level:</span>
                  <span className="text-blue-600">{pet1Data.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Happiness:</span>
                  <span className="text-green-600">{pet1Data.happiness}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Power:</span>
                  <span className="text-red-600">{pet1Data.power}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Multiplier:</span>
                  <span className="text-purple-600">{pet1Data.multiplier /1000}</span>
                </div>
                <div className="flex justify-between border-t-2 border-blue-200 pt-2 mt-3">
                  <span className="font-bold text-blue-700">Total Score:</span>
                  <span className="font-bold text-blue-700 text-lg">
                    {calculatePetScore(pet1Data)}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500">Loading pet data...</div>
          )}

          <div className="mt-4 text-center bg-white/50 rounded-lg p-3">
            <p className="text-sm font-bold text-gray-700">Total Stakes</p>
            <p className="font-bold text-blue-600 text-lg">
              {(battle.stake_total_pet1 / 1_000_000).toFixed(2)} TAILZ
            </p>
            <button className="bg-blue-500 p-3" onClick={() => handleStake(1)}>stake</button>
          </div>
        </div>

        {/* VS Divider */}
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl font-bold text-gray-400 mb-2">⚔️</div>
            <div className="text-2xl font-bold text-gray-600 font-pixelify">
              VS
            </div>
          </div>
        </div>

        {/* Pet 2 */}
        <div
          className={`border-3 rounded-xl p-6 transition-all duration-300 ${
            winner === 2
              ? "border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-lg transform scale-105"
              : "border-red-400 bg-gradient-to-br from-red-50 to-red-100"
          }`}
        >
          <h4 className="text-center font-bold mb-4 text-red-700 text-lg font-pixelify">
            🔴 Pet 2
          </h4>
          {pet2Data ? (
            <>
              <div className="text-center mb-4">
                <img
                  src={pet2Data.image_url}
                  alt={`Pet ${pet2Data.nft_id}`}
                  className="w-32 h-32 object-cover rounded-xl mx-auto shadow-md border-2 border-red-300"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-pet.png"; // Fallback image
                  }}
                />
              </div>
              <div className="space-y-2 text-sm font-medium text-gray-800">
                <div className="flex justify-between">
                  <span className="font-bold">ID:</span>
                  <span>{pet2Data.nft_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Level:</span>
                  <span className="text-blue-600">{pet2Data.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Happiness:</span>
                  <span className="text-green-600">{pet2Data.happiness}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Power:</span>
                  <span className="text-red-600">{pet2Data.power}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Multiplier:</span>
                  <span className="text-purple-600">{pet2Data.multiplier/1000}</span>
                </div>
                <div className="flex justify-between border-t-2 border-red-200 pt-2 mt-3">
                  <span className="font-bold text-red-700">Total Score:</span>
                  <span className="font-bold text-red-700 text-lg">
                    {calculatePetScore(pet2Data)}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500">Loading pet data...</div>
          )}

          <div className="mt-4 text-center bg-white/50 rounded-lg p-3">
            <p className="text-sm font-bold text-gray-700">Total Stakes</p>
            <p className="font-bold text-red-600 text-lg">
              {(battle.stake_total_pet2 / 1_000_000).toFixed(2)} TAILZ
            </p>
            <button className="bg-blue-500 p-3" onClick={()=>handleStake(2)}>stake</button>
          </div>
        </div>
      </div>

      {/* Battle Info Footer */}
      <div className="mt-6 pt-4 border-t-2 border-gray-200 bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center text-sm font-medium text-gray-700">
          <div className="flex items-center space-x-4">
            <span>👤 Creator: {battle.creator.slice(0, 8)}...</span>
            {address?.address === battle.creator && (
              <button onClick={handleDeclareWinner}>declare winner</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
