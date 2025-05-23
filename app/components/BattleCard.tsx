"use client";
import { useState, useEffect } from "react";
import { useCountdown } from "../hooks/useCountdown";
import { useSuiClient } from "@mysten/dapp-kit";

interface Battle {
  id: string;
  battle_id: number;
  pet1: string;
  pet2: string;
  stake_total_pet1: number;
  stake_total_pet2: number;
  creator: string;
  is_active: boolean;
  created_at: Date;
  duration: number;
}

interface Pet {
  nft_id: number;
  image_url: string;
  level: number;
  happiness: number;
  power: number;
  multiplier: number;
}

interface BattleCardProps {
  battle: Battle;
  onBattleEnd: (battleId: string, winner: number) => void;
}

const NFT_Collection_ID =
  "0xc03ee66d6922dcb94a79c1f8fb9252575044e117106219b725a3d4e032bce40b";

export default function BattleCard({ battle, onBattleEnd }: BattleCardProps) {
  const client = useSuiClient();
  const [pet1Data, setPet1Data] = useState<Pet | null>(null);
  const [pet2Data, setPet2Data] = useState<Pet | null>(null);
  const [battleEnded, setBattleEnded] = useState(false);
  const [winner, setWinner] = useState<number | null>(null);
  const [showWinnerAnimation, setShowWinnerAnimation] = useState(false);

  // Calculate target date for countdown
  const targetDate = new Date(
    battle.created_at.getTime() + battle.duration * 1000
  );
  const [days, hours, minutes, seconds] = useCountdown(targetDate);

  // Check if battle time is up
  const isTimeUp = days + hours + minutes + seconds <= 0;

  // Check if battle is older than 12 minutes (720 seconds)
  const battleAge = (new Date().getTime() - battle.created_at.getTime()) / 1000;
  const shouldHideBattle = battleAge > 720; // 12 minutes

  useEffect(() => {
    if (isTimeUp && !battleEnded && battle.is_active) {
      handleBattleEnd();
    }
  }, [isTimeUp, battleEnded, battle.is_active]);

  // Fetch pet data on component mount
  useEffect(() => {
    fetchPetData();
  }, [battle.pet1, battle.pet2]);

  // Hide battle after 12 minutes
  if (shouldHideBattle) {
    return null;
  }

  const fetchPetData = async () => {
    try {
      const collection = await client.getObject({
        id: NFT_Collection_ID,
        options: { showContent: true },
      });

      const nftsTableId =
        collection.data?.content?.fields?.nfts?.fields?.id?.id;
      const nfts = await client.getDynamicFields({ parentId: nftsTableId });

      const pet1Id = parseInt(battle.pet1);
      const pet2Id = parseInt(battle.pet2);

      for (const nft of nfts.data) {
        const nftData = await client.getObject({
          id: nft.objectId,
          options: { showContent: true },
        });

        const fields = nftData.data?.content?.fields;
        const nftId = fields?.nft_id;

        if (nftId === pet1Id) {
          setPet1Data({
            nft_id: fields?.nft_id,
            image_url: fields?.image_url,
            level: fields?.level,
            happiness: fields?.happiness,
            power: fields?.power,
            multiplier: fields?.multiplier,
          });
        }

        if (nftId === pet2Id) {
          setPet2Data({
            nft_id: fields?.nft_id,
            image_url: fields?.image_url,
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

  const handleBattleEnd = () => {
    if (!pet1Data || !pet2Data) return;

    const pet1Score = calculatePetScore(pet1Data);
    const pet2Score = calculatePetScore(pet2Data);

    const winnerPet = pet1Score > pet2Score ? 1 : 2;
    setWinner(winnerPet);
    setBattleEnded(true);
    setShowWinnerAnimation(true);

    // Hide animation after 3 seconds
    setTimeout(() => setShowWinnerAnimation(false), 3000);

    onBattleEnd(battle.id, winnerPet);
  };

  const formatTime = (value: number) => {
    return value.toString().padStart(2, "0");
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border-2 border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold font-pixelify text-gray-800">
          Battle #{battle.battle_id}
        </h3>
        <div className="flex items-center space-x-3">
          <span
            className={`px-4 py-2 rounded-full text-sm font-bold ${
              battle.is_active && !isTimeUp
                ? "bg-green-100 text-green-800 border-2 border-green-300"
                : "bg-red-100 text-red-800 border-2 border-red-300"
            }`}
          >
            {battle.is_active && !isTimeUp ? "🔥 Active" : "⏹️ Ended"}
          </span>
        </div>
      </div>

      {/* Countdown Timer - Centered and Prominent */}
      {battle.is_active && !isTimeUp && (
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
            <h4 className="text-lg font-bold mb-3 font-pixelify">
              ⏰ Time Remaining
            </h4>
            <div className="flex justify-center items-center space-x-3 text-3xl font-bold font-mono">
              {days > 0 && (
                <>
                  <div className="bg-white/20 rounded-lg px-3 py-2">
                    <span className="text-white">{formatTime(days)}</span>
                    <div className="text-xs text-white/80">DAYS</div>
                  </div>
                  <span className="text-white/60">:</span>
                </>
              )}
              <div className="bg-white/20 rounded-lg px-3 py-2">
                <span className="text-white">{formatTime(hours)}</span>
                <div className="text-xs text-white/80">HRS</div>
              </div>
              <span className="text-white/60">:</span>
              <div className="bg-white/20 rounded-lg px-3 py-2">
                <span className="text-white">{formatTime(minutes)}</span>
                <div className="text-xs text-white/80">MIN</div>
              </div>
              <span className="text-white/60">:</span>
              <div className="bg-white/20 rounded-lg px-3 py-2">
                <span className="text-white">{formatTime(seconds)}</span>
                <div className="text-xs text-white/80">SEC</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Winner Announcement - Centered and Animated */}
      {battleEnded && winner && (
        <div className="text-center mb-6">
          <div
            className={`bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl p-8 shadow-2xl border-4 border-yellow-300 transform transition-all duration-500 ${
              showWinnerAnimation ? "scale-105 animate-pulse" : "scale-100"
            }`}
          >
            <div className="text-6xl mb-4">🏆</div>
            <h4 className="text-3xl font-bold font-pixelify mb-2">VICTORY!</h4>
            <p className="text-xl font-bold">
              Pet {winner === 1 ? pet1Data?.nft_id : pet2Data?.nft_id} Wins!
            </p>
            <div className="mt-4 text-lg">
              <span className="bg-white/20 rounded-full px-4 py-2">
                🎉 Champion Crowned! 🎉
              </span>
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
                  <span className="text-purple-600">{pet1Data.multiplier}</span>
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
                  <span className="text-purple-600">{pet2Data.multiplier}</span>
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
          </div>
        </div>
      </div>

      {/* Battle Info Footer */}
      <div className="mt-6 pt-4 border-t-2 border-gray-200 bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center text-sm font-medium text-gray-700">
          <div className="flex items-center space-x-4">
            <span>👤 Creator: {battle.creator.slice(0, 8)}...</span>
            <span>⏱️ Duration: {battle.duration}s</span>
          </div>
          <div className="text-xs text-gray-500">
            Battle Age: {Math.floor(battleAge / 60)}m{" "}
            {Math.floor(battleAge % 60)}s
          </div>
        </div>
      </div>
    </div>
  );
}
