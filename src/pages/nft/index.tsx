import TokenIcon from 'components/TokenIcon'
import getNftCollections from 'lib/zilstream/getNftCollections'
import { InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import { cryptoFormat } from 'utils/format'

export const getServerSideProps = async () => {
  const collections = await getNftCollections()
  
  return {
    props: {
      collections,
    },
  }
}

function NftCollections({ collections }: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
            <col style={{width: '100px', minWidth: 'auto'}} />
          </colgroup>
          <thead className="text-gray-500 dark:text-gray-400 text-xs">
            <tr>
              <th className="text-left pl-4 pr-1 sm:pr-2 py-2">#</th>
              <th className="pl-3 pr-2 py-2 text-left">Token</th>
              <th className="px-2 py-2 text-right">Floor</th>
              <th className="px-2 py-2 text-right">Volume (7d)</th>
              <th className="px-2 py-2 text-right">Volume (All time)</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((collection, index) => (
              <tr role="row" className="text-sm border-b dark:border-gray-700 last:border-b-0">
                <td className={`pl-4 pr-1 sm:pr-2 py-3 font-normal text-sm ${index === 0 ? 'rounded-tl-lg' : ''} ${index === collections.length-1 ? 'rounded-bl-lg' : ''}`}>{index+1}</td>
                <td className="px-2 py-3 font-medium sticky left-0 z-10">
                  <Link href={`/tokens/`}>
                    <a className="flex items-center">
                      <div className="w-10 h-10 flex-shrink-0 flex-grow-0 mr-1 sm:mr-3 rounded overflow-hidden">
                        <TokenIcon url={collection.icon} />
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <span className="hidden lg:inline whitespace-nowrap">{collection.name}</span>
                            <span className="lg:font-normal ml-2 lg:text-gray-500 whitespace-nowrap">{collection.owner_name}</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  </Link>
                </td>
                <td className="px-2 py-3 font-normal text-right">{cryptoFormat(collection.market_data.floor_price)}</td>
                <td className="px-2 py-3 font-normal text-right">{cryptoFormat(collection.market_data.volume_7d)}</td>
                <td className={`px-2 py-3 font-normal text-right ${index === 0 ? 'rounded-tr-lg' : ''} ${index === collections.length-1 ? 'rounded-br-lg' : ''}`}>{cryptoFormat(collection.market_data.volume_all_time)}</td>
              </tr>
            ))}
            
          </tbody>
        </table>
      </div>
    </>
  )
}

export default NftCollections