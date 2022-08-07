import React from 'react';
import { Box } from 'react-feather';
import { LazyLoad } from 'react-observer-api';
import { useSelector } from 'react-redux';
import { CollectionState, Currency, CurrencyState, RootState } from 'store/types';
import { cryptoFormat, currencyFormat } from 'utils/format';
import NftImage from './NftImage';

function PortfolioCollections() {
  const collectionState = useSelector<RootState, CollectionState>(state => state.collection)
  const currencyState = useSelector<RootState, CurrencyState>(state => state.currency)
  const selectedCurrency: Currency = currencyState.currencies.find(currency => currency.code === currencyState.selectedCurrency)!

  let collections = collectionState.collections.filter(collection => collection.tokens && collection.tokens.length > 0)

  return (
    <>
      <div className="font-semibold text-xl mt-8 mb-3">NFT Collections</div>
      {collections.map(collection => (
        <div key={collection.address} className="mb-3 last:mb-0">
          <div className="flex items-center mb-2">
            <div className="flex-grow flex items-center">
              <div className="w-8 h-8 mr-2 rounded">
                <img src={collection.icon} />
              </div>
              <h2 className="text-lg">{collection.name}</h2>
            </div>
            <div>
              {/* <div className="inline-flex items-center mr-2 mb-2 text-sm px-2 py-1 rounded">
                <span className="font-medium mr-1">Floor:</span> {collection.market_data.floor_price} ZIL
              </div> */}
              <div className="inline-flex items-center mr-2 mb-2 text-sm px-2 py-1 rounded">
                <span className="font-semibold mr-1">Holding:</span> {currencyFormat(collection.market_data.floor_price * collection.tokens!.length * selectedCurrency.rate, selectedCurrency.symbol)} ({cryptoFormat(collection.market_data.floor_price * collection.tokens!.length)} ZIL)
              </div>
              <a href={`https://viewblock.io/zilliqa/address/${collection.address}`} target="_blank" className="inline-flex items-center mr-2 mb-2 text-sm bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 px-2 py-1 rounded">
                <Box size={12} className="mr-1" />
                ViewBlock 
              </a>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {collection.tokens!.map(token => (
              <div key={token.id}>
                <div className="aspect-square bg-white dark:bg-gray-800 overflow-hidden rounded-lg flex items-center justify-center">
                  <LazyLoad style={{'z-index': '10'}}>
                    <NftImage collection={collection} token={token} />
                  </LazyLoad>
                  <span className="absolute text-3xl font-bold text-gray-100 dark:text-gray-700">{token.id}</span>
                </div>
                <div className="text-sm flex items-center mt-1">
                  <span className="font-medium">#{token.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}

export default PortfolioCollections