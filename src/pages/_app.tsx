import type { AppProps } from 'next/app'
import '../styles/tailwind.css'
import '../styles/styles.css'
import Layout from '../components/Layout'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
