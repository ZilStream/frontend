import Head from 'next/head'
import React from 'react'

function Disclaimer() {
  return (
    <>
      <Head>
        <title>Disclaimer | ZilStream</title>
        <meta property="og:title" content="Disclaimer | ZilStream" />
        <meta name="description" content="ZilStream does not recommend that any cryptocurrency should be bought, sold, or held by you. Do conduct your research and consult your financial advisor before making any investment decisions." />
        <meta property="og:description" content="ZilStream does not recommend that any cryptocurrency should be bought, sold, or held by you. Do conduct your research and consult your financial advisor before making any investment decisions." />
      </Head>
      <div className="py-8 text-center">
        <h1 className="mb-1">Disclaimer</h1>
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-lg">No investment advice</h2>
          <p className="text-gray-800 dark:text-gray-300">The information provided on this website is not investment advice, trading advice or any other sort of advice and you should not treat any of the website's content as such. ZilStream does not recommend that any cryptocurrency should be bought, sold, or held by you. Do conduct your research and consult your financial advisor before making any investment decisions.</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg">No endorsements</h2>
          <p className="text-gray-800 dark:text-gray-300">Tokens and all other information displayed on ZilStream does not constitute an endorsement, guarantee, warranty or recommendation by ZilStream.</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg">Accuracy</h2>
          <p className="text-gray-800 dark:text-gray-300">ZilStream strives to accurately display information, but does not hold any responsibility for wrong or missing information. Information is provided as is, and it should be used at your own risk.</p>
        </div>
      </div>
    </>
  )
}

export default Disclaimer