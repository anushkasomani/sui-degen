"use client";
import { useState } from "react";
import { useAccounts, useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import BattleCreator from "../components/BattleCreator";
import BattleCard from "../components/BattleCard";

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

const battleCollectionId =
  "0xd848c8b40736f054f1834ac5d13699967989ae47e9a1f54338598e1fb8833466";

export default function BattlePage() {
  const client = useSuiClient();
  const [account] = useAccounts();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [battleDurations, setBattleDurations] = useState<{
    [key: string]: number;
  }>({});

  const { data: battles } = useQuery({
    queryKey: ["battles", refreshTrigger],
    queryFn: async () => {
      try {
        const collection = await client.getObject({
          id: battleCollectionId,
          options: { showContent: true },
        });

        const battlesTableId =
          collection.data?.content?.fields?.battles?.fields?.id?.id;
        const battles = await client.getDynamicFields({
          parentId: battlesTableId,
        });

        const battleData = await Promise.all(
          battles.data.map(async (battle) => {
            const battleData = await client.getObject({
              id: battle.objectId,
              options: { showContent: true },
            });

            const fields = battleData.data?.content?.fields;
            const battleId = fields?.battle_id;

            return {
              id: battleData.data?.objectId,
              battle_id: battleId,
              pet1: fields?.pet1,
              pet2: fields?.pet2,
              stake_total_pet1: fields?.stake_total_pet1,
              stake_total_pet2: fields?.stake_total_pet2,
              creator: fields?.creator,
              is_active: fields?.is_active,
              created_at: new Date(), // Client-side timestamp
              duration: battleDurations[battleId] || 300, // Use stored duration or default
            } as Battle;
          })
        );

        return battleData.sort((a, b) => b.battle_id - a.battle_id);
      } catch (error) {
        console.error("Error fetching battles:", error);
        return [];
      }
    },
    refetchInterval: 5000, // Refetch every 5 seconds for live updates
  });

  const handleBattleCreated = (duration: number) => {
    // Store the duration for the new battle
    const newBattleId = (battles?.length || 0) + 1;
    setBattleDurations((prev) => ({
      ...prev,
      [newBattleId]: duration,
    }));

    setRefreshTrigger((prev) => prev + 1);
  };

  const handleBattleEnd = (battleId: string, winner: number) => {
    console.log(`Battle ${battleId} ended. Winner: Pet ${winner}`);
    // Here you could implement TAILZ token transfer logic
  };

  // Filter out battles older than 12 minutes
  const activeBattles =
    battles?.filter((battle) => {
      const battleAge =
        (new Date().getTime() - battle.created_at.getTime()) / 1000;
      return battleAge <= 720; // 12 minutes
    }) || [];

  return (
    <div className="relative min-h-screen w-full">
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/bg-gen.png)" }}
      />

      <img
        src="/totoro_bg.png"
        alt="Totoro"
        className="absolute bottom-0 right-0 z-40 w-[250px] h-auto max-w-full md:max-w-[30%] sm:max-w-[40%]"
      />

      <div className="relative min-h-screen w-full flex items-center justify-center p-4">
        <div className="w-4/5 min-h-screen overflow-y-auto bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 border-2 border-gray-200">
          <h1 className="font-press-start-2p text-2xl md:text-3xl font-extrabold text-center text-gray-800 mb-8">
            ⚔️ PvP Battle Arena ⚔️
          </h1>

          {/* Battle Creator */}
          <BattleCreator onBattleCreated={handleBattleCreated} />

          {/* Battle Statistics */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">
                  {activeBattles.filter((b) => b.is_active).length}
                </div>
                <div className="text-sm font-medium">Active Battles</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {activeBattles.filter((b) => !b.is_active).length}
                </div>
                <div className="text-sm font-medium">Completed Battles</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{activeBattles.length}</div>
                <div className="text-sm font-medium">Total Battles</div>
              </div>
            </div>
          </div>

          {/* Ongoing Battles */}
          <div>
            <h2 className="text-2xl font-bold font-pixelify mb-6 text-gray-800">
              🔥 Live Battles
            </h2>

            {activeBattles.length > 0 ? (
              <div className="space-y-6">
                {activeBattles.map((battle) => (
                  <BattleCard
                    key={battle.id}
                    battle={battle}
                    onBattleEnd={handleBattleEnd}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏟️</div>
                <p className="text-xl text-gray-600 font-pixelify mb-4">
                  No battles found. Create the first one!
                </p>
                <p className="text-gray-500">
                  Start an epic battle between your favorite pets!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
