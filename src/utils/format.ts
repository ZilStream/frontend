export function currencyFormat(num: number, symbol: string = "$"): string {
  return symbol + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export function numberFormat(num: number, decimals: number = 2): string {
  return num.toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export function cryptoFormat(num: number): string {
  var decimals = 2
  if(num < 0) {
    decimals = 5
  }
  return num.toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
