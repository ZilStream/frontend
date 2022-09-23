import { fromBech32Address } from "@zilliqa-js/zilliqa"
import CopyableAddress from "components/CopyableAddress"
import NftImage from "components/NftImage"
import TokenIcon from "components/TokenIcon"
import getNftCollection from "lib/zilstream/getNftCollection"
import getNftRates from "lib/zilstream/getNftRates"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import dynamic from "next/dynamic"
import Head from "next/head"
import React, { useEffect, useState } from "react"
import { Box, Link as WebLink, MessageCircle } from "react-feather"
import { useSelector } from "react-redux"
import { BlockchainState, RootState } from "store/types"
import { Rate } from "types/rate.interface"
import { cryptoFormat } from "utils/format"
import { LazyLoad } from "react-observer-api"

const Chart = dynamic(
  () => import('components/Chart'),
  { ssr: false }
)

export const getServerSideProps = async (context: GetServerSidePropsContext) => {  
  const { address } = context.query

  const collection = await getNftCollection(address as string).catch(error => {
    return
  })
  if(!collection) {
    return {
      redirect: {
        destination: '/nft',
        permanent: false,
      },
    }
  }

  return {
    props: {
      collection,
    },
  }
}

function NftCollection({ collection }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [rates, setRates] = useState<Rate[]>([])
  const [tokens, setTokens] = useState<{[key: string]: string}>({})
  const blockchainState = useSelector<RootState, BlockchainState>(state => state.blockchain)
  const client = blockchainState.client

  async function getCollectionsRates() {
    let newRates = await getNftRates([collection.id])
    setRates(newRates)
  }

  async function getTokens() {
    const response = await client.blockchain.getSmartContractSubState(
      fromBech32Address(collection.address),
      'token_owners',
      []
    )
    setTokens(response.result.token_owners)
  }

  useEffect(() => {
    getCollectionsRates()
    getTokens()
  }, [collection])

  

  return (
    <>
      <Head>
        <title>{collection.name} NFT floor and info | ZilStream</title>
        <meta property="og:title" content={`${collection.name} NFT floor and info | ZilStream`} />
        <meta name="description" content={`Get the latest ${collection.name} NFT floor price, volume, and more.`} />
        <meta property="og:description" content={`Get the latest ${collection.name} NFT floor price, volume, and more.`} />
      </Head>
      <div className="w-full flex flex-col sm:flex-row items-center mt-8">
        <div className="flex items-center">
          <div className="flex-shrink-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 w-12 sm:w-16 h-12 sm:h-16 p-2 rounded-lg mr-3 mb-2 sm:mb-0">
            <TokenIcon url={collection.icon} />
          </div>
          <div>
            <h2 className="text-left">{collection.name}</h2>
            <div className="flex items-center">
              <span className="text-gray-500 dark:text-gray-300 text-sm sm:text-lg sm:mr-3 mb-1 sm:mb-0 font-medium">
                {collection.owner_name &&
                  <a href={`https://viewblock.io/zilliqa/address/${collection.owner_address}`} target="_blank" className="font-normal">{collection.owner_name}</a>
                }
              </span>
            </div>
          </div>
        </div>
        <div className="flex-grow text-right justify-end flex items-center gap-6 mt-4 sm:mt-0">
          <div className="flex flex-col">
            <span className="text-right">Floor</span>
            <span className="text-right font-semibold">{cryptoFormat(collection.market_data.floor_price)} ZIL</span>
          </div>
          <div className="flex flex-col">
            <span className="text-right">Volume (7d)</span>
            <span className="text-right font-semibold">{cryptoFormat(collection.market_data.volume_7d)} ZIL</span>
          </div>
          <div className="flex flex-col">
            <span className="text-right">Volume (all time)</span>
            <span className="text-right font-semibold">{cryptoFormat(collection.market_data.volume_all_time)} ZIL</span>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-start gap-6 mt-8 mb-6">
        <div className="w-full sm:w-96 flex-shrink-0 max-w-full">
          <div className="hidden sm:block text-gray-800 dark:text-gray-200 mt-2 text-sm">
            {collection.website &&
              <a href={collection.website} target="_blank" className="inline-flex items-center mr-2 mb-2 bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 px-2 py-1 rounded">
                <WebLink size={12} className="mr-1" />
                Website 
              </a>
            }

            {collection.telegram &&
              <a href={collection.telegram} target="_blank" className="inline-flex items-center mr-2 mb-2 bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 px-2 py-1 rounded">
                <MessageCircle size={12} className="mr-1" />
                <span>Telegram</span>
              </a>
            }

            {collection.discord &&
              <a href={collection.discord} target="_blank" className="inline-flex items-center mr-2 mb-2 bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 px-2 py-1 rounded">
                <MessageCircle size={12} className="mr-1" />
                <span>Discord</span>
              </a>
            }
            
            <a href={`https://viewblock.io/zilliqa/address/${collection.address}`} target="_blank" className="inline-flex items-center mr-2 mb-2 bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 px-2 py-1 rounded">
              <Box size={12} className="mr-1" />
              ViewBlock 
            </a>
            
            <div>
              <CopyableAddress address={collection.address} showCopy={true} />
            </div>
          </div>
          {collection.description &&
            <div className="py-8 text-center sm:text-left">
              <p>{collection.description}</p>
            </div>
          }
        </div>
        <div className="flex-grow">
          <div className="h-96 bg-white dark:bg-gray-800 rounded-lg p-4">
            <Chart data={rates} isZilValue={false} isUserInteractionEnabled={true} isScalesEnabled={true} />
          </div>
          {collection.address === 'zil13fum43ax8qeprt5s9u6wsmrtw2vsvdrdhmvtrm' &&
            <div className="flex justify-center py-3">
              <span className="text-gray-500 dark:text-gray-400 italic text-sm">„Find Jonny‘s favorite Soulless“</span>
            </div>
          }
        </div>
      </div>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {Object.keys(tokens).map(tokenId => (
          <div key={tokenId} className="aspect-square bg-white dark:bg-gray-800 overflow-hidden rounded-lg flex items-center justify-center">
            <LazyLoad>
              <NftImage collection={collection} token={{id: tokenId}} />
            </LazyLoad>
            <span className="absolute text-3xl font-bold text-gray-100 dark:text-gray-700">{tokenId}</span>
          </div>
        ))}
      </div> */}
    </>
  )
}

export default NftCollection