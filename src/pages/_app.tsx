import React, { FC } from 'react'
import { wrapper } from 'store/store'
import type { AppProps } from 'next/app'
import '../styles/tailwind.css'
import '../styles/styles.css'
import 'react-toastify/dist/ReactToastify.min.css';
import Layout from '../components/Layout'
import { ThemeProvider } from 'next-themes'
import StateProvider from 'components/StateProvider'

const WrappedApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ThemeProvider defaultTheme="system" enableSystem={true} attribute="class">
      <StateProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </StateProvider>
    </ThemeProvider>
  )
}

export default wrapper.withRedux(WrappedApp)

