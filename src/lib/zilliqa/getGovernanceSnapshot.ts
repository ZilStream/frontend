import { Snapshot } from "types/snapshot.interface"

export default async function getGovernanceSnapshot(hash: string): Promise<Snapshot> {
  const res = await fetch(`https://gateway.pinata.cloud/ipfs/${hash}`)
  return await res.json()
}