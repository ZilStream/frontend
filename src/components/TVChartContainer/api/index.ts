import getTokenPair from 'lib/zilstream/getPair';
import { ErrorCallback, HistoryCallback, OnReadyCallback, PeriodParams, ResolveCallback, SearchSymbolsCallback, SubscribeBarsCallback, SymbolResolveExtension } from '../../../../public/charting_library/charting_library';
import { Bar, LibrarySymbolInfo, ResolutionString } from '../../../../public/charting_library/datafeed-api';
import { UdfCompatibleConfiguration } from '../../../../public/datafeeds/udf/src/udf-compatible-datafeed-base';

const config: UdfCompatibleConfiguration = {
  supports_search: false,
  supports_group_request: true,
  supported_resolutions: [
    '15' as ResolutionString,
    '30' as ResolutionString,
    '60' as ResolutionString,
		'240' as ResolutionString,
    '1D' as ResolutionString,
		'1W' as ResolutionString
  ],
  supports_marks: false,
  supports_timescale_marks: false,
}; 

export default {
	onReady: (callback: OnReadyCallback) => {
		setTimeout(() => callback(config))
	},
	searchSymbols: (userInput: string, exchange: string, symbolType: string, onResult: SearchSymbolsCallback) => {
	},
	resolveSymbol: async (symbolName: string, onResolve: ResolveCallback, onError: ErrorCallback, extension?: SymbolResolveExtension) => {
		let parts = symbolName.split('/')
		let pair = await getTokenPair(parts[0], parts[1], parts[2])

		var exchange = parts[0]
		if(parts[0] === 'zilswap') {
			exchange = 'ZilSwap'
		} else if(parts[0] === 'xcaddex') {
			exchange = 'XCADDEX'
		} else if(parts[0] === 'carbswap') {
			exchange = 'CarbSwap'
		}

		var description = pair.pair
		if(parts[3] === 'USD') {
			description = pair.base_symbol + '/USD (calculated by zilstream.com)'
		}

		var symbol_stub: LibrarySymbolInfo = {
			name: pair.pair,
			full_name: symbolName,
			description: description,
			ticker: symbolName,
			type: 'crypto',
			exchange: exchange,
			listed_exchange: exchange,
			format: "price",
			minmov: 1,
			pricescale: 100,
			has_intraday: true,
			// intraday_multipliers: ['15', '60'],
			supported_resolutions: config.supported_resolutions ?? [],
			// volume_precision: 8,
			data_status: 'pulsed',
			session: '24x7',
			timezone: 'Etc/UTC'
		}
		
		setTimeout(() => onResolve(symbol_stub))
	},
	getBars: function(symbolInfo: LibrarySymbolInfo, resolution: ResolutionString, periodParams: PeriodParams, onResult: HistoryCallback, onError: ErrorCallback) {
		var parts = symbolInfo.ticker?.split('/')
		if(!parts) {
			setTimeout(() => onError("Invalid address details"))
			return
		}
		var res: ResolutionString|string = resolution
		if(resolution === '1D') {
			res = '1440'
		} else if(resolution === '1W') {
			res = '10080'
		}
    fetch(`https://io.zilstream.com/chart/bars/${parts[0]}/${parts[1]}/${parts[2]}?from=${periodParams.from}&to=${periodParams.to}&res=${res}&cb=${periodParams.countBack}`)
      .then(response => response.json())
      .then((data: any) => {
        if (data.length) {
          var bars: Bar[] = []
          data.forEach((el: any) => {
            let bar: Bar = {
              time: el.timestamp * 1000,
              low: parts?.[3] === 'USD' ? el.low_usd : el.low,
              high: parts?.[3] === 'USD' ? el.high_usd : el.high,
              open: parts?.[3] === 'USD' ? el.open_usd : el.open,
              close: parts?.[3] === 'USD' ? el.close_usd : el.close,
							volume: parts?.[3] === 'USD' ? el.volume_usd : el.volume
            }
            bars.push(bar)
          })
          bars.sort((a,b) => a.time > b.time ? 1 : -1)
          setTimeout(() => onResult(bars, {noData: false}))
        } else {
          setTimeout(() => onResult([], {noData: true}))
        }
      })
      .catch((err: any) => {
        setTimeout(() => onError(err))
      })
	},
	subscribeBars: (symbolInfo: LibrarySymbolInfo, resolution: ResolutionString, onTick: SubscribeBarsCallback, listenerGuid: string, onResetCacheNeededCallback: () => void) => {
		// console.log('subscribe bars')
	},
	unsubscribeBars: (listenerGuid: string) => {
		// console.log('unsub bars')
	}
}