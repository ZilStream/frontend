import exp from "constants";

export function currencyFormat(
  num: number,
  symbol: string = "$",
  decimals: number = 2
): string {
  if (num === undefined) return "";
  if (symbol === "₿") {
    return symbol + num.toFixed(8);
  }
  if (num === 0) {
    return symbol + num.toFixed(2);
  }
  if (num < 0.00001) {
    return symbol + num.toFixed(12);
  }
  if (num < 0.5) {
    return symbol + num.toFixed(5);
  }
  if (num > 10000) {
    decimals = 0;
  }
  return (
    symbol + num.toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
  );
}

export function numberFormat(num: number, decimals: number = 2): string {
  if (num < 0.1) {
    return num.toFixed(decimals);
  }
  return num.toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export function cryptoFormat(num: number, decimals: number = 2): string {
  if (num % 1 === 0) {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  } else if (num < 0.00001) {
    return num.toFixed(10);
  } else if (num < 0.1) {
    return num.toFixed(5);
  } else if (num > 10000) {
    decimals = 0;
  }
  return num.toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export function compactFormat(num: number, symbol: string = "$"): string {
  let formatter = Intl.NumberFormat("en", { notation: "compact" });
  return symbol + formatter.format(num);
}

export function fieldFormat(num: number, decimals: number = 8): string {
  if (num % 1 === 0) {
    return num.toFixed(0);
  } else if (num < 0.1) {
    return num.toFixed(5);
  } else if (num < 1000) {
    return num.toFixed(4);
  } else if (num < 10000) {
    return num.toFixed(2);
  } else if (num < 100000) {
    return num.toFixed(1);
  } else if (num < 10000000) {
    return num.toFixed(0);
  }
  return num.toFixed(decimals);
}
