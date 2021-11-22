const api_root = 'https://api.zilstream.com'
const history: any = {}

export default {
	history: history,

  getBars: function(symbolInfo: any, resolution: any, from: any, to: any, first: any, limit: any) {
    var symbol = symbolInfo.name
    
    return fetch(`${api_root}/rates/${symbol}?interval=15m&period=1d`)
      .then(response => response.json())
      .then((data: any) => {
        if (data.length) {
          var bars = data.map((el: any) => {
            return {
              time: Date.parse(el.time),
              low: el.low,
              high: el.high,
              open: el.open,
              close: el.close,
              volume: 0
            }
          })
          if (first) {
            var lastBar = bars[bars.length - 1]
            history[symbol] = {lastBar: lastBar}
          }
          return bars
        } else {
          return []
        }
      })
  }
}