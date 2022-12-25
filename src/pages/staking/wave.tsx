import Head from 'next/head'
import React from 'react'
import { useSelector } from 'react-redux'
import { AccountState, RootState, StakingState } from 'store/types'
import { AccountType } from 'types/walletType.interface'
import { cryptoFormat, numberFormat } from 'utils/format'

function Wave() {
  const stakingState = useSelector<RootState, StakingState>(state => state.staking)
  const waveOperator = stakingState.operators.filter(operator => operator.name === 'Wave')?.[0]
  const accountState = useSelector<RootState, AccountState>(state => state.account)

  return (
    <>
      <Head>
        <title>Wave | ZilStream</title>
        <meta property="og:title" content={`Wave | ZilStream`} />
      </Head>

      <div className="bg-gradient-to-b from-cyan-500 to-blue-500 flex flex-col items-center px-12 py-20 rounded-xl">
        <h1 className="text-white text-8xl">Wave</h1>
        <h2 className="text-white opacity-70">Powered by ZilStream + Carbon</h2>

        <p className="max-w-xl text-xl text-white text-center py-12">Introducing Wave SSN, a Zilliqa staking node powered by ZilStream and Carbon Labs. Support independent ecosystem developers by staking your ZIL at Wave.</p>

        {waveOperator &&
          <div className="grid grid-cols-3 gap-12">
            <div className="text-center p-4">
              <div className="text-4xl font-bold text-white mb-2">{cryptoFormat(waveOperator.stake_amount.shiftedBy(-12).toNumber())} ZIL</div>
              <div className="uppercase text-white opacity-70">Currently staked</div>
            </div>

            <div className="text-center p-4">
              <div className="text-4xl font-bold text-white mb-2">{numberFormat(waveOperator.comission.shiftedBy(-7).toNumber())}%</div>
              <div className="uppercase text-white opacity-70">Commission</div>
            </div>

            <div className="text-center p-4">
              <div className="text-4xl font-bold text-white mb-2">{cryptoFormat(waveOperator.stake_amount.shiftedBy(-12).toNumber())}</div>
              <div className="uppercase text-white opacity-70">Currently staked</div>
            </div>
          </div>
        }

        <div className="bg-white bg-opacity-20 rounded-lg px-4 py-8 w-full mt-20 text-center flex flex-col items-center">
          <h2 className="text-white">Stake now at Wave</h2>
          <p className="text-white text-lg opacity-70 mb-6">And get 13.29% APR on your ZIL</p>
          {accountState.selectedWallet && accountState.selectedWallet.type === AccountType.ZilPay && accountState.selectedWallet.isConnected ? (
            <div className="flex flex-col max-w-xl">
              <input className="rounded-lg bg-white bg-opacity-50 py-3 px-4 text-xl outline-none text-center text-white font-bold" />
              <button className="rounded-lg bg-white bg-opacity-80 py-3 px-4 text-lg font-bold mt-1">Stake</button>
            </div>
          ) : (
            <button>Connect</button>
          )}
        </div>
      </div>
    </>
  )
}

export default Wave