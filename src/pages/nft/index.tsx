import TokenIcon from 'components/TokenIcon'
import getNftRates from 'lib/zilstream/getNftRates'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { CollectionState, RootState } from 'store/types'
import { Rate } from 'types/rate.interface'
import { cryptoFormat } from 'utils/format'

const Chart = dynamic(
  () => import('components/Chart'),
  { ssr: false }
)

function NftCollections() {
  const collectionState = useSelector<RootState, CollectionState>(state => state.collection)
  const [rates, setRates] = useState<Rate[]>([])

  let collections = useMemo(() => {
    if(!collectionState.initialized) return []
    return collectionState.collections
  }, [collectionState])

  async function getCollectionsRates() {
    let ids = collections.map(collection => collection.id)
    if(ids.length === 0) return
    let newRates = await getNftRates(ids)
    setRates(newRates)
  }

  useEffect(() => {
    getCollectionsRates()
  }, [collections])

  return (
    <>
      <Head>
        <title>NFT Collections | ZilStream</title>
        <meta property="og:title" content={`NFT Collections | ZilStream`} />
      </Head>
      <div className="pt-8 pb-2 md:pb-8">
        <div className="flex flex-col lg:flex-row items-start">
          <div className="flex-grow">
            <h1 className="mb-1">NFT Collections</h1>
          </div>
        </div>
      </div>
      <div className="scrollable-table-container max-w-full overflow-x-scroll">
        <table className="zilstream-table table-fixed border-collapse">
          <colgroup>
            <col style={{width: '22px', minWidth: 'auto', maxWidth: '22px'}} />
            <col style={{width: '300px', minWidth: 'auto'}} />
            <col style={{width: '100px', minWidth: 'auto'}} />
            <col style={{width: '100px', minWidth: 'auto'}} />
            <col style={{width: '120px', minWidth: 'auto'}} />
            <col style={{width: '160px', minWidth: 'auto'}} />
          </colgroup>
          <thead className="text-gray-500 dark:text-gray-400 text-xs">
            <tr>
              <th className="text-left pl-4 pr-1 sm:pr-2 py-2">#</th>
              <th className="pl-3 pr-2 py-2 text-left">Collection</th>
              <th className="px-2 py-2 text-right">Floor</th>
              <th className="px-2 py-2 text-right">Volume (7d)</th>
              <th className="px-2 py-2 text-right">Volume (All time)</th>
              <th className="px-2 py-2 text-right">Floor (30d)</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((collection, index) => (
              <tr key={collection.id} role="row" className="text-sm border-b dark:border-gray-700 last:border-b-0">
                <td className={`pl-4 pr-1 sm:pr-2 py-3 font-normal text-sm ${index === 0 ? 'rounded-tl-lg' : ''} ${index === collections.length-1 ? 'rounded-bl-lg' : ''}`}>{index+1}</td>
                <td className="px-2 py-3 font-medium sticky left-0 z-10">
                  <Link href={`/nft/${collection.address}`}>
                    <a className="flex items-center">
                      <div className="w-10 h-10 flex-shrink-0 flex-grow-0 mr-1 sm:mr-3 rounded overflow-hidden">
                        <TokenIcon url={collection.icon} />
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center">
                        <div className="flex flex-col">
                          <div className="flex flex-col md:flex-row items-start md:items-center">
                            <span className="ml-2 truncate w-44 md:w-64 lg:w-auto">{collection.name}</span>
                            <span className="font-normal ml-2 text-gray-500 truncate inline-block w-32 xl:w-48">{collection.owner_name}</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  </Link>
                </td>
                <td className="px-2 py-3 font-normal text-right">{cryptoFormat(collection.market_data.floor_price)}</td>
                <td className="px-2 py-3 font-normal text-right">{cryptoFormat(collection.market_data.volume_7d)}</td>
                <td className="px-2 py-3 font-normal text-right">{cryptoFormat(collection.market_data.volume_all_time)}</td>
                <td className={`px-2 py-2 justify-end ${index == 0 ? 'rounded-tr-lg' : ''} ${index === collections.length-1 ? 'rounded-br-lg' : ''}`}>
                  <div className="flex justify-end">
                    <a className="w-28" style={{height: '52px'}}>
                      <Chart data={rates.filter(rate => rate.collection_id === collection.id)} isZilValue={false} isUserInteractionEnabled={false} isScalesEnabled={false} />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default NftCollections