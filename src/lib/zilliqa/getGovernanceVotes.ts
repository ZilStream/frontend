import { Vote } from "types/vote.interface"

export default async function getGovernanceVotes(hash: string): Promise<{[id: string]: Vote}> {
  const res = await fetch(`https://governance-api.zilliqa.com/api/zwap/proposal/${hash}`)
  return await res.json()
}