import React, { FC } from 'react'
import { AppProps } from 'next/app'
import { wrapper } from 'store/store'
import { ThemeProvider } from 'next-themes'
import Layout from '../components/Layout'
import '../styles/tailwind.css'
import '../styles/styles.css'

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
