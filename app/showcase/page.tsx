'use client'
import { useQuery } from "@tanstack/react-query";
import { useSuiClient } from "@mysten/dapp-kit";
import NFTCard from "../components/NFTCard";
const NFT_Collection_ID="0x7208c789a817a2aed6736673274669ff0ae78b29854d003137d451bd2f8c69f6"
export default function Home(){
  const client= useSuiClient();
  const { data: nfts } = useQuery({
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
  });

  return(
    <div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Your NFTs</h2>
      
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nfts?.map((nft) => (
                    <NFTCard key={nft.id} nft={nft} />
                  ))}
                </div>
                </div>
          
        
      </div>
  )
}