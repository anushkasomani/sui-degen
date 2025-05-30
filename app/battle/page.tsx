"use client";
import { useState } from "react";
import { useAccounts, useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import BattleCreator from "../components/BattleCreator";
import BattleCard from "../components/BattleCard";
import { battleCollectionId } from "../utils/constants";

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
  stake_info: StakeInfo;
  created_at: number;

}

export default function BattlePage() {
  const client = useSuiClient();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Handler to refresh battles when a new battle is created
  function handleBattleCreated() {
    setRefreshTrigger((prev) => prev + 1);
  }

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
              stake_total_pet1: Number(fields?.stake_total_pet1),
              stake_total_pet2: Number(fields?.stake_total_pet2),
              creator: fields?.creator,
              is_active: fields?.is_active,
              stake_info: fields?.stake_info,
              created_at:fields?.created_at
              
            } as Battle;
          })
        );

        return battleData.sort((a, b) => b.battle_id - a.battle_id);
      } catch (error) {
        console.error("Error fetching battles:", error);
        return [];
      }
    },
    refetchInterval: 5000, 
  });
console.log("battles are", battles)
  // Defensive fallback for battles
  const safeBattles = Array.isArray(battles) ? battles : [];

  return (
    <div className="relative min-h-screen w-full font-courier-prime">
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
                  {safeBattles.filter((b) => b.is_active).length}
                </div>
                <div className="text-sm font-medium">Active Battles</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {safeBattles.filter((b) => !b.is_active).length}
                </div>
                <div className="text-sm font-medium">Completed Battles</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{safeBattles.length}</div>
                <div className="text-sm font-medium">Total Battles</div>
              </div>
            </div>
          </div>

          {/* Ongoing Battles */}
          <div>
            <h2 className="text-2xl font-bold font-pixelify mb-6 text-gray-800">
              🔥 Live Battles
            </h2>

            {safeBattles.length > 0 ? (
              <div className="space-y-6">
                {safeBattles.map((battle) => (
                  <BattleCard
                    key={battle.id}
                    battle={battle}
                    onBattleEnd={() => setRefreshTrigger((prev) => prev + 1)}
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