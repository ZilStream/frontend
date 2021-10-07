export default async function getBridgeAssets(fromBlock: string, toBlock: string): Promise<AssetResponse> {
  const res = await fetch(`https://bridge-monitor.zilstream.com/assets?from_block=${fromBlock}&to_block=${toBlock}`)
  return res.json()
}

export interface AssetResponse {
  total_usd_value: number
  assets: Asset[]
  wallets: { [id: string] : AssetWallet }
}

export interface Asset {
  symbol: string
  address: string
  amount: number
  usd_value: number
}

export interface AssetWallet {
  address: string
  total_usd_value: number
  assets: Asset[]
}