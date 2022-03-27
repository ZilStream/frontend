import TokenIcon from 'components/TokenIcon'
import getGovernanceSnapshot from 'lib/zilliqa/getGovernanceSnapshot'
import getGovernanceSpaces from 'lib/zilliqa/getGovernanceSpaces'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { AccountState, RootState, Token, TokenState } from 'store/types'
import { ProposalMessage } from 'types/proposal.interface'
import { Snapshot } from 'types/snapshot.interface'
import { Space } from 'types/space.interface'
import marked from 'marked'
import { fromBech32Address, toBech32Address } from '@zilliqa-js/zilliqa'
import getGovernanceVotes from 'lib/zilliqa/getGovernanceVotes'
import useMoneyFormatter, { toBigNumber } from 'utils/useMoneyFormatter'
import { Vote } from 'types/vote.interface'
import BigNumber from 'bignumber.js'
import Link from 'next/link'
import LoadingSpaceHeader from 'components/LoadingSpaceHeader'
import LoadingProposal from 'components/LoadingProposal'
import { shortenAddress } from 'utils/shorten'
import CastVote from 'components/CastVote'
import dayjs from 'dayjs'
import Head from 'next/head'

function VoteProposal() {
  const router = useRouter()
  const { symbol, hash } = router.query

  const tokenState = useSelector<RootState, TokenState>(state => state.token)
  const accountState = useSelector<RootState, AccountState>(state => state.account)

  const [space, setSpace] = useState<Space>()
  const [snapshot, setSnapshot] = useState<Snapshot>()
  const [votes, setVotes] = useState<{[id: string]: Vote}>()
  const [token, setToken] = useState<Token|null>(null)
  const [totalBalance, setTotalBalance] = useState<BigNumber>(new BigNumber(0))
  const [votedBalance, setVotedBalance] = useState<BigNumber>(new BigNumber(0))
  const moneyFormat = useMoneyFormatter()
  const [votesExpanded, setVotesExpanded] = useState<boolean>(false)
  const [vote, setVote] = useState<Vote|null>(null)
  const [balance, setBalance] = useState<BigNumber|null>(null)
  const [msg, setMsg] = useState<ProposalMessage|null>(null)
  const [status, setStatus] = useState<'upcoming'|'active'|'closed'|'invalid'>('upcoming')

  async function getSpace() {
    const spacesRes = await getGovernanceSpaces()
    const newSpaces = Object.values(spacesRes)
    Object.keys(spacesRes).forEach((key, index) => {
      newSpaces[index].slug = key
    })
    setSpace(newSpaces.filter(s => s.slug.toLowerCase() === symbol)[0])
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

    await getVotes(snapshotRes)
  }

  async function getVotes(s: Snapshot) {
    const votesRes = await getGovernanceVotes(symbol as string, hash as string)
    setVotes(votesRes)

    var balance = new BigNumber(0)
    Object.values(votesRes).forEach(vote => {
      const b = toBigNumber(s.balances[vote.address.toLowerCase()])
      balance = balance.plus(b)
    })
    setVotedBalance(balance)
  }

  async function findToken() {
    const tokens = tokenState.tokens.filter(t => t.symbol.toLowerCase() === space?.symbol.toLowerCase() as string)
    console.log(tokens, space)
    if(tokens.length > 0) {
      setToken(tokens[0])
    }
  }

  useEffect(() => {
    if(symbol === undefined || hash === undefined || !tokenState.initialized) return

    getSpace()
  }, [symbol, hash, tokenState])

  useEffect(() => {
    if(!space) return
    findToken()
    getSnapshot()
  }, [space])
  

  useMemo(() => {
    if(snapshot) {
      const newMsg = JSON.parse(snapshot.msg)
      setMsg(newMsg)
      
      if(newMsg) {
        if(hash === 'QmdbfEAd4ukcPd4N9yyfosS2asEcgq4ptC5RJH8CbaheeA') {
          setStatus('invalid')
        } else if(dayjs.unix(newMsg.payload.start).isAfter(dayjs())) {
          setStatus('upcoming')
        } else if(dayjs.unix(newMsg.payload.start).isBefore(dayjs()) && dayjs.unix(newMsg.payload.end).isAfter(dayjs())) {
          setStatus('active')
        } else {
          setStatus('closed')
        }
      }
    }
  }, [snapshot])

  useEffect(() => {
    if(!accountState.selectedWallet) {
      setVote(null)
      setBalance(null)
      return
    }

    if(votes && Object.values(votes).filter(vote => vote.address === fromBech32Address(accountState.selectedWallet!.address)).length > 0) {
      setVote(Object.values(votes).filter(vote => vote.address === fromBech32Address(accountState.selectedWallet!.address))[0])
    }
  
    if(snapshot?.balances[fromBech32Address(accountState.selectedWallet.address).toLowerCase()] !== undefined) {
      setBalance(toBigNumber(snapshot?.balances[fromBech32Address(accountState.selectedWallet.address).toLowerCase()]))
    }
  }, [votes, snapshot, accountState.selectedWallet])

  return (
    <>
      <Head>
        <title>{msg?.payload.name ?? 'Proposal'} | ZilStream</title>
        <meta property="og:title" content={`${msg?.payload.name ?? 'Proposal'} | ZilStream`} />
        <meta name="description" content={`${token?.symbol ?? 'Token'} governance proposal: ${msg?.payload.name}`} />
        <meta property="og:description" content={`${token?.symbol ?? 'Token'} governance proposal: ${msg?.payload.name}`} />
      </Head>
      <div className="max-w-5xl mx-auto">
        {token ? (
          <div className="flex items-center gap-3 pt-8 pb-4">
            <div className="w-16 h-16 rounded-lg"><TokenIcon address={token?.address} /></div>
            <div className="flex flex-col">
              <Link href={`/vote/${space?.symbol.toLowerCase()}`}>
                <a className="font-normal">
                  <div className="font-semibold">{space?.name}</div>
                  <div>{space?.symbol}</div>
                </a>
              </Link>
            </div>
          </div>
        ) : (
          <LoadingSpaceHeader />
        )}
        
        {space && snapshot && msg ? (
          <>
            <div className="mb-2 flex items-center">
              {space?.members.includes(toBech32Address(snapshot.address)) &&
                <div className="text-sm bg-primary dark:bg-primaryDark px-2 rounded-full mr-2">Core</div>
              }

              <div className="text-xl font-semibold">{msg.payload.name}</div>
            </div>
            <div className="flex flex-col md:flex-row items-stretch md:items-start gap-4">
              <div className="flex-grow">
                <div className="bg-white dark:bg-gray-800 py-4 md:py-6 px-5 md:px-7 rounded-lg">
                  <div className="proposal" dangerouslySetInnerHTML={{__html: marked(msg.payload.body, { breaks: true })}}></div>
                </div>
                <div className="mt-8">
                  <div className="flex items-center">
                    <div className="font-semibold flex-grow">Votes</div>
                  </div>

                  {votes && Object.keys(votes).length > 0 &&
                    <div className={`scrollable-table-container max-w-full overflow-x-scroll text-sm relative overflow-hidden ${votesExpanded ? '' : 'h-96'}`}>
                      <table className="zilstream-table table-fixed border-collapse">
                        <colgroup>
                          <col style={{width: '120px', minWidth: 'auto'}} />
                          <col style={{width: '120px', minWidth: 'auto'}} />
                          <col style={{width: '100px', minWidth: 'auto'}} />
                        </colgroup>
                        <thead className="text-gray-500 dark:text-gray-400 text-xs">
                          <tr>
                            <th className="pl-4 pr-2 py-2 text-left">Address</th>
                            <th className="px-2 py-2 text-left">Choice</th>
                            <th className="px-2 py-2 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(votes).sort((a,b) => {
                            const aBalance = toBigNumber(snapshot.balances[a.toLowerCase()])
                            const bBalance = toBigNumber(snapshot.balances[b.toLowerCase()])
                            return aBalance.isGreaterThan(bBalance) ? -1 : 1
                          }).map((address, index) => {
                            let vote = votes[address]
                            const amount = toBigNumber(snapshot.balances[vote.address.toLowerCase()])
                            const bechAddress = toBech32Address(address)
                            return (
                              <tr key={index} role="row" className="text-sm border-b dark:border-gray-700 last:border-b-0">
                                <td className={`pl-4 pr-2 py-2 font-medium ${index === 0 ? 'rounded-tl-lg' : ''} ${index === Object.keys(votes).length-1 ? 'rounded-bl-lg' : ''}`}>
                                  <a href={`https://viewblock.io/zilliqa/address/${bechAddress}`} target="_blank" className="font-normal">
                                    <span className="hidden sm:inline truncate">{bechAddress}</span>
                                    <span className="inline sm:hidden">{shortenAddress(bechAddress)}</span>
                                  </a>
                                </td>
                                <td className="px-2 py-2 text-left font-medium">{msg?.payload.choices[vote.msg.payload.choice-1]}</td>
                                <td className={`px-2 py-2 font-medium text-right whitespace-nowrap ${index === 0 ? 'rounded-tr-lg' : ''} ${index === Object.keys(votes).length-1 ? 'rounded-br-lg' : ''}`}>{moneyFormat(amount, {compression: token?.decimals})} {space?.symbol}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                      
                      {!votesExpanded &&
                        <div className="absolute bottom-0 left-0 w-full p-4 h-24 text-center bg-gradient-to-t from-white dark:from-gray-700 flex flex-col">
                          <div className="flex-grow"></div>
                          <button onClick={() => setVotesExpanded(true)} className="font-medium focus:outline-none">Expand to see all votes</button>
                        </div>
                      }
                    </div>
                  }

                  {votesExpanded &&
                    <div className="text-center mt-4">
                      <button onClick={() => setVotesExpanded(false)} className="font-medium text-gray-500 focus:outline-none">Collapse to see less votes</button>
                    </div>
                  }


                  {votes && Object.keys(votes).length === 0 &&
                    <div className="bg-white dark:bg-gray-800 py-4 px-5 rounded-lg text-gray-500 dark:text-gray-400 italic">No votes have been casted yet.</div>
                  }
                </div>
              </div>
              <div className="md:w-80 md:flex-grow-0 md:flex-shrink-0">
                <div className="bg-white dark:bg-gray-800 py-4 px-5 rounded-lg">
                  <div className="mb-2 pb-2 border-b dark:border-gray-700">
                    <div className="font-medium">Status</div>
                    <div>
                      {status === 'upcoming' &&
                        <span className="block text-sm">Upcoming</span>
                      }

                      {status === 'active' &&
                        <span className="block text-primary text-sm font-semibold">Active</span>
                      }

                      {status === 'closed' &&
                        <span className="block text-sm">Closed</span>
                      }

                      {status === 'invalid' &&
                        <span className="block text-sm">Invalid</span>
                      }
                    </div>
                  </div>

                  <div className="mb-2 pb-2 border-b dark:border-gray-700">
                    <div className="font-medium">Voting starts</div>
                    <div className="text-sm">{dayjs.unix(msg.payload.start).format("MMM D, YYYY - HH:mm")}</div>
                  </div>

                  <div className="">
                    <div className="font-medium">Voting ends</div>
                    <div className="text-sm">{dayjs.unix(msg.payload.end).format("MMM D, YYYY - HH:mm")}</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 py-4 px-5 rounded-lg mt-4">
                  <div className="mb-2 pb-2 border-b dark:border-gray-700">
                    <div className="font-medium">Total voting power</div>
                    <div>{moneyFormat(totalBalance, {compression: token?.decimals, maxFractionDigits: 2})} <span className="text-gray-500 dark:text-gray-400">{moneyFormat(Object.values(snapshot.balances).filter(b => toBigNumber(b).isGreaterThan(0)).length, {maxFractionDigits: 0})} holders</span></div>
                  </div>

                  {votes &&
                    <>
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
                        if(share.isNaN()) {
                          share = new BigNumber(0)
                        }

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
                    </>
                  }
                  
                </div>

                {status === 'active' ? (
                  <>
                    {accountState.selectedWallet?.address === '' &&
                      <div className="bg-white dark:bg-gray-800 py-4 px-5 rounded-lg mt-4 text-sm text-gray-500 dark:text-gray-400 italic">
                        <div>Connect your wallet before you can vote.</div>
                      </div>
                    }

                    {vote &&
                      <div className="bg-white dark:bg-gray-800 py-4 px-5 rounded-lg mt-4">
                        <div>You've already voted:</div>
                        <div className="font-semibold">{msg?.payload.choices[vote.msg.payload.choice-1]}</div>
                      </div>
                    }

                    {!vote && balance && balance.isGreaterThan(0) && token &&
                      <CastVote token={space.token} proposal={hash! as string} choices={msg.payload.choices} balance={balance} tokenInfo={token} onVoted={() => getVotes(snapshot)} />
                    }

                    {!balance || (balance && balance.isZero()) &&
                      <div className="bg-white dark:bg-gray-800 py-4 px-5 rounded-lg mt-4 text-sm text-gray-500 dark:text-gray-400 italic">
                        <div>You didn't have any {token?.symbol} at the time of the snapshot.</div>
                      </div>
                    }
                  </>
                ) : (
                  <>
                    {vote &&
                      <div className="bg-white dark:bg-gray-800 py-4 px-5 rounded-lg mt-4">
                        <div>You've already voted:</div>
                        <div className="font-semibold">{msg?.payload.choices[vote.msg.payload.choice-1]}</div>
                      </div>
                    }
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <LoadingProposal />
        )} 
      </div>
    </>
  )
}

export default VoteProposal