import { Bar, LibrarySymbolInfo, ResolutionString } from 'charting_library/datafeed-api';
import { UdfCompatibleConfiguration } from 'datafeeds/udf/src/udf-compatible-datafeed-base';

const supportedResolutions = ["15", "60", "240", "D"]

const config: UdfCompatibleConfiguration = {
  supports_search: false,
  supports_group_request: true,
  supported_resolutions: [
    '15' as ResolutionString,
    '30' as ResolutionString,
    '60' as ResolutionString,
		'240' as ResolutionString,
    '1D' as ResolutionString
  ],
  supports_marks: false,
  supports_timescale_marks: false,
}; 

export default {
	onReady: (cb: any) => {
		setTimeout(() => cb(config), 0)
	},
	searchSymbols: () => {
	},
	resolveSymbol: (symbolName: string, onSymbolResolvedCallback: any, onResolveErrorCallback: any) => {
		// expects a symbolInfo object in response
		var symbol_stub = {
			name: symbolName,
			description: symbolName,
			type: 'crypto',
			exchange: 'ZilSwap',
			minmov: 0.00001,
			pricescale: 100,
			has_intraday: true,
			// intraday_multipliers: ['15', '60'],
			supported_resolution:  supportedResolutions,
			// volume_precision: 8,
			data_status: 'static',
		}
		
		setTimeout(function() {
			onSymbolResolvedCallback(symbol_stub)
		}, 0)
		
		
		// onResolveErrorCallback('Not feeling it today')

	},
	getBars: function(symbolInfo: LibrarySymbolInfo, resolution: string, from: any, to: any, onHistoryCallback: any, onErrorCallback: any, firstDataRequest: any) {
		var res = resolution
		if(resolution === '5') {
			res = '5m'
		} else if(resolution === '15') {
			res = '15m'
		} else if(resolution === '30') {
			res = '30m'
		} else if(resolution === '60') {
			res = '60m'
		} else if(resolution === '240') {
			res = '4h'
		} else if(resolution === '1D') {
			res = '1day'
		}
    fetch(`https://api.zilstream.com/rates/${symbolInfo.name}?interval=${res}&from=${from}&to=${to}`)
      .then(response => response.json())
      .then((data: any) => {
        if (data.length) {
          var bars: Bar[] = []
          data.forEach((el: any) => {
            let bar = {
              time: Date.parse(el.time),
              low: el.low,
              high: el.high,
              open: el.open,
              close: el.close,
            }
            bars.push(bar)
          })
          bars.sort((a,b) => a.time > b.time ? 1 : -1)
          onHistoryCallback(bars, {noData: false})
        } else {
          onHistoryCallback([], {noData: true})
        }
      })
      .catch((err: any) => {
        console.log({err})
        onErrorCallback(err)
      })
	},
	subscribeBars: (symbolInfo: any, resolution: any, onRealtimeCallback: any, subscribeUID: any, onResetCacheNeededCallback: any) => {
	},
	unsubscribeBars: (subscriberUID: any) => {
	},
	calculateHistoryDepth: (resolution: any, resolutionBack: any, intervalBack: any) => {
		//optional
		// while optional, this makes sure we request 24 hours of minute data at a time
		// CryptoCompare's minute data endpoint will throw an error if we request data beyond 7 days in the past, and return no data
		return resolution < 60 ? {resolutionBack: 'D', intervalBack: '1'} : undefined
	},
	getMarks: (symbolInfo: any, startDate: any, endDate: any, onDataCallback: any, resolution: any) => {
		//optional
	},
	getTimeScaleMarks: (symbolInfo: any, startDate: any, endDate: any, onDataCallback: any, resolution: any) => {
		//optional
	},
	getServerTime: (cb: any) => {
    return new Date().getTime()
	}
}