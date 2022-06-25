import { NftCollection } from "types/nftCollection.interface"

export default async function getNftCollections(): Promise<NftCollection[]>  {
  const res = await fetch(`${process.env.NEXT_PUBLIC_IO_URL}/nft/collections`)
  return await res.json()
}