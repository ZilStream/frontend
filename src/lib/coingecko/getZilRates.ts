export default async function getZilRates() {
  const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=zilliqa&vs_currencies=usd,eur,sgd,gbp,btc')
  return await res.json()
}