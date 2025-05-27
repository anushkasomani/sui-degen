'use client'
import { useQuery } from "@tanstack/react-query";
import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import NFTCard from "../components/NFTCard";
import { ConnectButton } from "@mysten/dapp-kit";
import { NFT_Collection_ID } from "../utils/constants";

export default function Home(){
  const client = useSuiClient();
  const currentAccount = useCurrentAccount();
  
  const { data: nfts, isLoading, error } = useQuery({
    queryKey: ["nfts"],
    queryFn: async () => {
      const collection = await client.getObject({
        id: NFT_Collection_ID,
        options: { showContent: true },
      });

      const nftsTableId =
        collection.data?.content?.fields?.nfts?.fields?.id?.id;

      const nfts = await client.getDynamicFields({
        parentId: nftsTableId,
      });

      return Promise.all(
        nfts.data.map(async (nft) => {
          const nftData = await client.getObject({
            id: nft.objectId,
            options: { showContent: true },
          });

          // The fields are nested in nftData.data.content.fields
          const fields = nftData.data?.content?.fields;
          console.log(nftData.data.content.fields.nft_id);
          return {
            id: nftData.data?.objectId,
            image_url: nftData.data.content.fields.image_url, // Url is a struct, value is the string
            level: nftData.data.content.fields.level,
            nft_id: nftData.data.content.fields.nft_id,
            owner: nftData.data.content.fields.owner,
            happiness: nftData.data.content.fields.happiness,
            power: nftData.data.content.fields.power,
            multiplier: nftData.data.content.fields.multiplier,
            points: nftData.data.content.fields.points,
          };
        })
      );
    },
    enabled: !!currentAccount,
  });

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-green-100 border-4 border-white rounded-xl p-4 animate-pulse shadow-lg"
        >
          <div className="bg-green-200 h-48 rounded-lg mb-4"></div>
          <div className="space-y-3">
            <div className="bg-green-200 h-6 rounded"></div>
            <div className="bg-green-200 h-4 rounded w-3/4"></div>
            <div className="bg-green-200 h-4 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return(
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-pixelify text-[#8B4513] mb-4 drop-shadow-lg">
            🎮  Pet Collection 🎮
          </h1>
          <div className="bg-white border-4 border-[#8B4513] rounded-xl p-4 inline-block shadow-lg">
            <p className="text-lg font-pixelify text-[#8B4513]">
              Hello! Explore NFT Pets here .
            </p>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="bg-white border-4 border-[#8B4513] rounded-xl shadow-2xl p-6 md:p-8">
          
          {/* Top Section with Connect Button and Title */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 p-4 bg-gradient-to-r from-yellow-100 to-yellow-200 border-2 border-yellow-400 rounded-lg">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-pixelify text-[#8B4513] drop-shadow-sm">
                🏆Overall NFTs
              </h2>
              <div className="bg-green-500 text-white px-3 py-1 rounded-lg font-pixelify text-sm border-2 border-green-600">
                Total: {nfts?.length || 0}
              </div>
            </div>
            
            {/* Connect Button positioned at top right */}
            <div className="font-pixelify">
              <ConnectButton />
            </div>
          </div>

          {/* Connection Status & Content */}
          {!currentAccount ? (
            <div className="text-center py-12">
              <div className="bg-yellow-100 border-4 border-yellow-400 rounded-xl p-8 inline-block">
                <h3 className="text-2xl font-pixelify text-[#8B4513] mb-4">
                  🔌 Connect Your Wallet
                </h3>
                <p className="text-lg font-pixelify text-yellow-700">
                  Please connect your wallet to view the NFTs!
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-100 border-4 border-red-400 rounded-xl p-8 inline-block">
                <h3 className="text-2xl font-pixelify text-red-700 mb-4">
                  ⚠ Oops! Something went wrong
                </h3>
                <p className="text-lg font-pixelify text-red-600">
                  Failed to load your NFTs. Please try again!
                </p>
              </div>
            </div>
          ) : isLoading ? (
            <LoadingSkeleton />
          ) : nfts && nfts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {nfts.map((nft) => (
                <NFTCard key={nft.id} nft={nft} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 border-4 border-gray-400 rounded-xl p-8 inline-block">
                <h3 className="text-2xl font-pixelify text-[#8B4513] mb-4">
                  🐾 No NFTs Found
                </h3>
                <p className="text-lg font-pixelify text-gray-600">
                  You don't have any pixelated pets yet. Start your collection!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Stats Section */}
        {nfts && nfts.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border-4 border-green-500 rounded-xl p-4 text-center shadow-lg">
              <h4 className="font-pixelify text-green-700 text-lg">Total Pets</h4>
              <p className="font-pixelify text-2xl text-[#8B4513] font-bold">{nfts.length}</p>
            </div>
            <div className="bg-white border-4 border-blue-500 rounded-xl p-4 text-center shadow-lg">
              <h4 className="font-pixelify text-blue-700 text-lg">Avg Level</h4>
              <p className="font-pixelify text-2xl text-[#8B4513] font-bold">
                {Math.round(nfts.reduce((acc, nft) => acc + (nft.level || 0), 0) / nfts.length)}
              </p>
            </div>
            <div className="bg-white border-4 border-purple-500 rounded-xl p-4 text-center shadow-lg">
              <h4 className="font-pixelify text-purple-700 text-lg">Total Power</h4>
              <p className="font-pixelify text-2xl text-[#8B4513] font-bold">
                {nfts.reduce((acc, nft) => acc + (nft.power || 0), 0)}
              </p>
            </div>
            <div className="bg-white border-4 border-yellow-500 rounded-xl p-4 text-center shadow-lg">
              <h4 className="font-pixelify text-yellow-700 text-lg">Total Points</h4>
              <p className="font-pixelify text-2xl text-[#8B4513] font-bold">
                {nfts.reduce((acc, nft) => acc + (nft.points || 0), 0)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
