export default async function getZilRates() {
  // const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=zilliqa&vs_currencies=usd,eur,sgd,gbp,btc,inr,cad,cny,idr,aud,nzd,thb,rub,jpy,myr')
  const res = await fetch(
    "https://www.binance.com/api/v3/ticker/price?symbol=ZILUSDT"
  );
  return await res.json();
}
