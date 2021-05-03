import React from 'react'

interface Props {
  onConnect: () => void
}

function PortfolioOnboard(props: Props) {
  return (
    <>
      <div className="mt-12 pt-8 pb-2 md:pb-8 text-center">
        <h1 className="mb-1">Portfolio</h1>
        <p className="text-lg">Track the performance of your Zilliqa wallet</p>

        <div className="mt-12 flex justify-center">
          <div className="p-6 w-128 bg-white dark:bg-gray-700 rounded-lg flex flex-col items-center">
            <div className="font-bold text-xl">Connect your wallet</div>
            <div className="py-12 flex flex-col items-stretch">
              <button 
                className="bg-gray-300 dark:bg-gray-800 py-3 px-6 rounded-full font-medium focus:outline-none"
                onClick={() => props.onConnect()}
              >ZilPay</button>
            </div>
            <div className="text-sm text-gray-400"><span className="font-semibold">Note:</span> Connecting your Wallet does not give ZilStream access to your private keys, and no transactions can be sent. ZilStream does not store your wallet address on its servers.</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PortfolioOnboard