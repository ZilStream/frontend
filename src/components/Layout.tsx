import React, { useEffect, useState } from 'react'
import Header from './Header'
import Head from 'next/head'
import Footer from './Footer'
import { useRouter } from 'next/router'
import PageLoading from './PageLoading'
import MarketBar from './MarketBar'
import WalletModal from './WalletModal'
import CurrencyModal from './Swap/components/CurrencyModal'
import SwapPopover from './Swap/SwapPopover'
import Link from 'next/link'

interface Props {
  children: React.ReactNode
}

export default function Layout(props: Props) {
  const { children } = props
  const router = useRouter()

  const [state, setState] = useState({
    isRouteChanging: false,
    loadingKey: 0,
  })

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setState((prevState) => ({
        ...prevState,
        isRouteChanging: true,
        loadingKey: prevState.loadingKey ^ 1,
      }))
    }

    const handleRouteChangeEnd = () => {
      setState((prevState) => ({
        ...prevState,
        isRouteChanging: false,
      }))
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)
    router.events.on('routeChangeComplete', handleRouteChangeEnd)
    router.events.on('routeChangeError', handleRouteChangeEnd)

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
      router.events.off('routeChangeComplete', handleRouteChangeEnd)
      router.events.off('routeChangeError', handleRouteChangeEnd)
    }
  }, [router.events])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0,viewport-fit=cover" />

        <title>ZilStream</title>
        <meta property="og:site_name" content="ZilStream" />
        <meta name="twitter:site" content="@zilstream" />
      
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-ios.png" />
        <meta name="apple-mobile-web-app-title" content="ZilStream" />
        <meta name="mobile-web-app-capable" content="yes" />

        {process.env.NEXT_PUBLIC_ENVIRONMENT === 'production' &&
          <script async defer data-domain="zilstream.com" src="https://plausible.zilstream.com/js/plausible.js"></script>
        }
      </Head>
      <div className="flex flex-col min-h-screen">
        <PageLoading isRouteChanging={state.isRouteChanging} key={state.loadingKey} />
        <Header />
        <MarketBar />
        <div className="container flex-grow">
          <WalletModal />
          <CurrencyModal />
          <div className="px-3 md:px-4 my-4 flex-grow">{children}</div>
          {router.pathname !== '/swap' &&
            <>
              <SwapPopover className="hidden sm:block" />

              <Link href="/swap">
                <a className="sm:hidden fixed bottom-10 right-5 sm:right-10 bg-primary rounded-full font-semibold py-3 px-5 flex items-center focus:outline-none">
                  <svg width="22" height="22" className="fill-current stroke-current mr-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 3L20 7L16 11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 7H20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 21L3 17L7 13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17 17H3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-sm">Swap</span>
                </a>
              </Link>
            </>
          }
        </div>
        <Footer />
      </div>
    </>
  )
}