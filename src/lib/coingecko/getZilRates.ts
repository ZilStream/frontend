export default async function getZilRates() {
  const res = await fetch("https://io-cdn.zilstream.com/zil-rates");
  return await res.json();
}
