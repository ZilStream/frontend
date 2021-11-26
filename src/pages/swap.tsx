import Swap from 'components/Swap'
import Head from 'next/head'
import React from 'react'

function SwapPage() {
  return (
    <>
      <Head>
        <title>Swap | ZilStream</title>
        <meta property="og:title" content="Swap | ZilStream" />
      </Head>
      <div className="flex items-center justify-center mt-12">
        <div className="w-128 max-w-full bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-900 py-4 px-5">
          {/* <Swap /> */}
        </div>
      </div>
    </>
  )
}

export default SwapPage