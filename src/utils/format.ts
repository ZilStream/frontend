export function currencyFormat(num: number, symbol: string = "$"): string {
  return symbol + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}