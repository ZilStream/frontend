import TokenIcon from 'components/TokenIcon'
import getGovernanceSnapshot from 'lib/zilliqa/getGovernanceSnapshot'
import getGovernanceSpaces from 'lib/zilliqa/getGovernanceSpaces'
import { useRouter } from 'next/dist/client/router'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState, TokenInfo, TokenState } from 'store/types'
import { ProposalMessage } from 'types/proposal.interface'
import { Snapshot } from 'types/snapshot.interface'
import { Space } from 'types/space.interface'
import marked from 'marked'
import { toBech32Address } from '@zilliqa-js/zilliqa'
import getGovernanceVotes from 'lib/zilliqa/getGovernanceVotes'
import useMoneyFormatter, { toBigNumber } from 'utils/useMoneyFormatter'
import { Vote } from 'types/vote.interface'
import BigNumber from 'bignumber.js'
import LoadingTransactions from 'components/LoadingTransactions'
import Link from 'next/link'
import LoadingSpaceHeader from 'components/LoadingSpaceHeader'
import LoadingProposal from 'components/LoadingProposal'

function VoteProposal() {
  const router = useRouter()
  const { symbol, hash } = router.query

  const tokenState = useSelector<RootState, TokenState>(state => state.token)
  const [space, setSpace] = useState<Space>()
  const [snapshot, setSnapshot] = useState<Snapshot>()
  const [votes, setVotes] = useState<{[id: string]: Vote}>()
  const [token, setToken] = useState<TokenInfo|null>(null)
  const [totalBalance, setTotalBalance] = useState<BigNumber>(new BigNumber(0))
  const [votedBalance, setVotedBalance] = useState<BigNumber>(new BigNumber(0))
  const moneyFormat = useMoneyFormatter()

  async function getSpace() {
    const spacesRes = await getGovernanceSpaces()
    const newSpaces = Object.values(spacesRes)
    setSpace(newSpaces.filter(s => s.symbol.toLowerCase() === symbol)[0])
  }

  async function getSnapshot() {
    const snapshotRes = await getGovernanceSnapshot(hash as string)
    setSnapshot(snapshotRes)

    var tBalance = new BigNumber(0)
    Object.values(snapshotRes.balances).forEach(value => {
      const b = toBigNumber(value)
      tBalance = tBalance.plus(b)
    })
    setTotalBalance(tBalance)

    const votesRes = await getGovernanceVotes(symbol as string, hash as string)
    setVotes(votesRes)

    var balance = new BigNumber(0)
    Object.values(votesRes).forEach(vote => {
      const b = toBigNumber(snapshotRes.balances[vote.address.toLowerCase()])
      balance = balance.plus(b)
    })
    setVotedBalance(balance)
  }

  async function findToken() {
    const tokens = tokenState.tokens.filter(t => t.symbol.toLowerCase() === symbol as string)
    if(tokens.length > 0) {
      setToken(tokens[0])
    }
  }

  useEffect(() => {
    if(symbol === undefined || hash === undefined || !tokenState.initialized) return

    findToken()
    getSpace()
    getSnapshot()
  }, [symbol, hash, tokenState])

  var msg: ProposalMessage|null = null
  if(snapshot) {
    msg = JSON.parse(snapshot.msg)
  }
  
  return (
    <div>
      {token ? (
        <div className="flex items-center gap-3 pt-8 pb-4">
          <div className="w-16 h-16 rounded-lg"><TokenIcon address={token?.address_bech32} /></div>
          <div className="flex flex-col">
            <Link href={`/vote/${space?.symbol.toLowerCase()}`}>
              <a className="font-normal">
                <div className="font-semibold">{token?.name}</div>
                <div>{token?.symbol}</div>
              </a>
            </Link>
          </div>
        </div>
      ) : (
        <LoadingSpaceHeader />
      )}
      
      {votes && snapshot && msg ? (
        <>
          <div className="mb-2 flex items-center">
            {space?.members.includes(toBech32Address(snapshot.address)) &&
              <div className="text-sm bg-primary dark:bg-primaryDark px-2 rounded-full mr-2">Core</div>
            }

            <div className="text-xl font-semibold">{msg.payload.name}</div>
          </div>
          <div className="flex flex-col md:flex-row items-stretch md:items-start gap-4">
            <div className="bg-white dark:bg-gray-800 py-4 px-5 rounded-lg flex-grow">
              <div className="proposal" dangerouslySetInnerHTML={{__html: marked(msg.payload.body)}}></div>
            </div>
            <div className="bg-white dark:bg-gray-800 py-4 px-5 rounded-lg md:w-80 md:flex-grow-0 md:flex-shrink-0">
              <div className="mb-2 pb-2 border-b dark:border-gray-700">
                <div className="font-medium">Total voting power</div>
                <div>{moneyFormat(totalBalance, {compression: token?.decimals, maxFractionDigits: 2})} <span className="text-gray-500 dark:text-gray-400">{moneyFormat(Object.values(snapshot.balances).filter(b => toBigNumber(b).isGreaterThan(0)).length, {maxFractionDigits: 0})} holders</span></div>
              </div>

              <div className="mb-4 pb-2 border-b dark:border-gray-700">
                <div className="font-medium">Voted power</div>
                <div>{moneyFormat(votedBalance, {compression: token?.decimals, maxFractionDigits: 2})} <span className="text-gray-500 dark:text-gray-400">{moneyFormat(Object.keys(votes).length, {maxFractionDigits: 0})} voters</span></div>
              </div>

              {msg.payload.choices.map((choice, index) => {
                var choiceBalance = new BigNumber(0)

                const choiceVotes = Object.values(votes).filter(vote => vote.msg.payload.choice === index+1)
                choiceVotes.forEach(vote => {
                  const b = toBigNumber(snapshot.balances[vote.address.toLowerCase()])
                  choiceBalance = choiceBalance.plus(b)
                })

                var share = choiceBalance.dividedBy(votedBalance).times(100)

                return (
                  <div key={choice} className="mb-3 last:mb-0 text-sm">
                    <div className="flex items-center">
                      <div className="flex-grow font-semibold">{choice}</div>
                      <div className="font-medium">{share.toFixed(2)}%</div>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <div className="flex-grow">{moneyFormat(choiceBalance, {compression: token?.decimals})} {space?.symbol}</div>
                      <div>{choiceVotes.length} votes</div>
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-full relative">
                      <div className="absolute left-0 top-0 h-full bg-primary rounded-full" style={{width: `${share}%`}}></div>
                    </div>
                  </div>
                )            
              })}
            </div>
          </div>
        </>
      ) : (
        <LoadingProposal />
      )} 
    </div>
  )
}

export default VoteProposal