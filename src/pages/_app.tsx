import React, { FC } from 'react'
import { wrapper } from 'store/store'
import type { AppProps } from 'next/app'
import '../styles/tailwind.css'
import '../styles/styles.css'
import Layout from '../components/Layout'
import { ThemeProvider } from 'next-themes'

const WrappedApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ThemeProvider defaultTheme="system" enableSystem={true} attribute="class">
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  )
}

export default wrapper.withRedux(WrappedApp)

