import { toBech32Address } from '@zilliqa-js/zilliqa'
import LoadingProposals from 'components/LoadingProposals'
import LoadingSpaceHeader from 'components/LoadingSpaceHeader'
import TokenIcon from 'components/TokenIcon'
import dayjs from 'dayjs'
import getGovernanceProposals from 'lib/zilliqa/getGovernanceProposals'
import getGovernanceSpaces from 'lib/zilliqa/getGovernanceSpaces'
import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Proposal } from 'types/proposal.interface'
import { Space } from 'types/space.interface'

function VoteTokenDetail() {
  const router = useRouter()
  const { symbol } = router.query

  const [space, setSpace] = useState<Space|null>(null)
  const [proposals, setProposals] = useState<Proposal[]>([])

  async function getSpace() {
    const spacesRes = await getGovernanceSpaces()
    const newSpaces = Object.values(spacesRes)
    setSpace(newSpaces.filter(s => s.symbol.toLowerCase() === symbol)[0])
  }

  async function getProposals() {
    const proposalsDict = await getGovernanceProposals(symbol as string)
    const newProposals = Object.values(proposalsDict)
    newProposals.sort((a, b) => {
      return a.msg.payload.end < b.msg.payload.end ? 1 : -1
    })
    setProposals(newProposals)
  }

  useEffect(() => {
    if(symbol === undefined) return
    getSpace()
    getProposals()
  }, [symbol])

  return (
    <>
      <Head>
        <title>{space?.symbol.toUpperCase() ?? ''} proposals | ZilStream</title>
        <meta property="og:title" content={`${space?.symbol.toUpperCase() ?? ''} proposals | ZilStream`} />
        <meta name="description" content={`${space?.symbol.toUpperCase() ?? ''} governance proposals`} />
        <meta property="og:description" content={`${space?.symbol.toUpperCase() ?? ''} governance proposals`} />
      </Head>
      <div className="max-w-5xl mx-auto">
        {space ? (
          <div className="flex items-center gap-3 pt-8 pb-4">
            <div className="w-16 h-16 bg-gray-300 dark:bg-gray-800 p-2 rounded-lg"><TokenIcon address={space?.token} /></div>
            <div className="flex flex-col">
              <div className="font-semibold">{space?.name}</div>
              <div>{space?.symbol}</div>
            </div>
          </div>
        ) : (
          <LoadingSpaceHeader />
        )}
        
        {proposals.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 px-5 rounded-lg">
            {proposals.map((proposal, index) => {
              return (
                <div key={index} className="py-4 border-b dark:border-gray-700 last:border-b-0">
                  <div><Link href={`/vote/${symbol}/${proposal.authorIpfsHash}`}><a className="font-medium">{proposal.msg.payload.name}</a></Link></div>
                  <div className="flex items-center gap-2">
                    <div className="text-gray-500 dark:text-gray-400">Starts {dayjs.unix(proposal.msg.payload.start).format("MM-DD-YYYY")}, ends {dayjs.unix(proposal.msg.payload.end).format("MM-DD-YYYY")}</div>
                    {space?.members.includes(toBech32Address(proposal.address)) &&
                      <div className="text-sm bg-gray-200 dark:bg-gray-600 px-2 rounded-full">Core</div>
                    }

                    {dayjs.unix(proposal.msg.payload.start).isBefore(dayjs()) && dayjs.unix(proposal.msg.payload.end).isAfter(dayjs()) &&
                      <div className="text-sm bg-primary dark:bg-primaryDark px-2 rounded-full">Active</div>
                    }
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <LoadingProposals />
        )}
      </div>
    </>
  )
}

export default VoteTokenDetail