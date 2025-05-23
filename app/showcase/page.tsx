'use client'
import { useQuery } from "@tanstack/react-query";
import { useSuiClient } from "@mysten/dapp-kit";
import NFTCard from "../components/NFTCard";
import { ConnectButton } from "@mysten/dapp-kit";
const NFT_Collection_ID="0xc03ee66d6922dcb94a79c1f8fb9252575044e117106219b725a3d4e032bce40b"
const package_id="0x58ef067daa0ad013898fb0a8c05cab46820c6521bfc0ec5570c20747d55d3d12"
const global_id="0x7aeb26d8e631b516a9d0f2789214867bba25ffff6a8d520d68ae5c52440be2f6"
const battleCollectionId="0xd848c8b40736f054f1834ac5d13699967989ae47e9a1f54338598e1fb8833466"
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
          <ConnectButton/>
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