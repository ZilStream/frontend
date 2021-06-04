import React, { useEffect, useState } from 'react'
import Header from './Header'
import Head from 'next/head'
import Footer from './Footer'
import { useRouter } from 'next/dist/client/router'
import PageLoading from './PageLoading'
import MarketBar from './MarketBar'

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
      <div className="flex flex-col h-full">
        <PageLoading isRouteChanging={state.isRouteChanging} key={state.loadingKey} />
        <Header />
        <MarketBar />
        <div className="container">
          <div className="px-3 md:px-4 my-4 flex-grow">{children}</div>
        </div>
        <Footer />
      </div>
    </>
  )
}