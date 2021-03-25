import React from 'react'

interface Props {
  onSelectAddress: (address: string) => void
}

function PortfolioOnboard(props: Props) {
  return (
    <div className="mt-12 pt-8 pb-2 md:pb-8 text-center">
      <h1 className="mb-1">Portfolio</h1>
      <p className="text-lg">Track the performance of your Zilliqa wallet</p>

      <div className="mt-12">
        <form className="flex items-stretch justify-center">
          <input
            className="w-96 bg-gray-700 px-3 py-2 rounded-lg mr-2 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Enter your wallet address" />
          <button className="px-3 py-1 rounded-lg bg-primary font-medium hover:shadow-md">
            View portfolio
          </button>
        </form>
      </div>
    </div>
  )
}

export default PortfolioOnboard