import { Space } from "types/space.interface"

export default async function getGovernanceSpaces(): Promise<{[id: string]: Space}> {
  const res = await fetch('https://governance-api.zilliqa.com/api/spaces')
  return await res.json()
}