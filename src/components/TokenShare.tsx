import React, { useCallback, useRef } from 'react'
import { toJpeg } from 'html-to-image'
import TokenIcon from './TokenIcon'
import { Currency, CurrencyState, RootState, Token } from 'store/types'
import { cryptoFormat, currencyFormat } from 'utils/format'
import InlineChange from './InlineChange'
import { useSelector } from 'react-redux'

interface Props {
  token: Token
}

const TokenShare = (props: Props) => {
  const { token } = props
  const shareImageRef = useRef<HTMLDivElement>(null)
  const currencyState = useSelector<RootState, CurrencyState>(state => state.currency)
  const selectedCurrency: Currency = currencyState.currencies.find(currency => currency.code === currencyState.selectedCurrency)!

  const onShare = useCallback(() => {
    if(shareImageRef.current === null) return

    toJpeg(shareImageRef.current, { quality: 1, pixelRatio: 1 })
      .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = 'token.jpg';
        link.href = dataUrl;
        link.click();
      });
  }, [shareImageRef])

  return (
    <>
      <div id="tokenCard" ref={shareImageRef} className="w-144 h-96 bg-gray-900 text-white border p-11" style={{zIndex: -1}}>
        <div className="flex flex-col items-stretch w-full">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12">
              <TokenIcon url={token.icon} />
            </div>
            <div className="text-4xl font-extrabold flex-grow">
              {token.name}
            </div>
            <div className="text-4xl font-medium text-gray-400">
              {token.symbol}
            </div>
          </div>
          <div className="text-4xl flex items-center mt-3">
            <span className="flex-grow flex items-center gap-2 font-bold">{currencyFormat(token.market_data.rate_zil * selectedCurrency.rate, selectedCurrency.symbol)} <span className="text-gray-400 text-2xl">{cryptoFormat(token.market_data.rate_zil)} ZIL</span></span>
            <span className="text-3xl ml-1"><InlineChange num={token.market_data.change_percentage_24h} bold /></span>
          </div>

          <div className="mt-8 text-2xl flex items-center py-3 border-t border-b border-gray-300 dark:border-gray-800">
            <div className="flex-grow">Market Cap</div>
            <div className="flex items-center gap-2 font-semibold">
              {currencyFormat(token.market_data.market_cap_zil * selectedCurrency.rate, selectedCurrency.symbol, 0)}
            </div>
          </div>

          <div className="text-2xl flex items-center py-3 border-b border-gray-300 dark:border-gray-800">
            <div className="flex-grow flex items-center gap-2">Volume <span className="px-2 py-1 ml-1 text-base font-medium bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded">24h</span></div>
            <div className="flex items-center gap-2 font-semibold">
              {currencyFormat(token.market_data.daily_volume_zil * selectedCurrency.rate, selectedCurrency.symbol, 0)}
            </div>
          </div>

          <div className="text-gray-400 font-medium mt-6">
            More Zilliqa market data on <span className="font-bold">ZilStream.com</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default TokenShare