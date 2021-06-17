import React from 'react'

const PortfolioOnboard = () => {
  return (
    <>
      <div className="mt-12 pt-8 pb-2 md:pb-8 text-center">
        <h1 className="mb-1">Portfolio</h1>
        <p className="text-lg">Track the performance of your Zilliqa wallet</p>

        <div className="mt-12 flex justify-center">
          <div className="p-6 rounded-lg flex flex-col items-center">
            <div className="rounded-lg overflow-hidden border-gray-900 shadow-md mb-6">
              <img src="/images/connect-wallet.png" className="block" />
            </div>
            <div>Connect your wallet to start tracking your portfolio.</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PortfolioOnboard