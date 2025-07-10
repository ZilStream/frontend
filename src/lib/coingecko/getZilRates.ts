export default async function getZilRates() {
  try {
    // Try primary source first
    const res = await fetch("https://io-cdn.zilstream.com/zil-rates");
    const data = await res.json();

    // Check if all rates are 0
    if (data?.zilliqa && typeof data.zilliqa === "object") {
      const rates = Object.values(data.zilliqa);
      const allZero = rates.every(
        (rate: any) =>
          rate === 0 || rate === "0" || rate === null || rate === undefined
      );

      if (!allZero) {
        return data;
      }
    }

    // Fallback to CoinGecko if all rates are 0 or data is invalid
    console.warn(
      "Primary source returned all zero rates, falling back to CoinGecko API"
    );
    const fallbackRes = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=zilliqa&vs_currencies=usd,eur,sgd,gbp,btc,inr,cad,cny,idr,aud,nzd,thb,rub,jpy,myr"
    );
    return await fallbackRes.json();
  } catch (error) {
    console.error(
      "Error fetching from primary source, trying fallback:",
      error
    );

    // Fallback to CoinGecko on any error
    try {
      const fallbackRes = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=zilliqa&vs_currencies=usd,eur,sgd,gbp,btc,inr,cad,cny,idr,aud,nzd,thb,rub,jpy,myr"
      );
      return await fallbackRes.json();
    } catch (fallbackError) {
      console.error("Both primary and fallback sources failed:", fallbackError);
      throw fallbackError;
    }
  }
}
