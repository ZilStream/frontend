import Chart from 'components/Chart'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { Rate } from 'shared/rate.interface'
import { Token } from 'shared/token.interface'

export const getServerSideProps = async (context: GetServerSidePropsContext) => {  
  const { symbol } = context.query

  const [tokenRes, ratesRes] = await Promise.all([
    fetch(`${process.env.BACKEND_URL}/token?symbol=${symbol}`),
    fetch(`${process.env.BACKEND_URL}/rates?symbol=${symbol}`)
  ])

  const token: Token = await tokenRes.json()
  const rates: Rate[] = await ratesRes.json()

  return {
    props: {
      token,
      rates,
    },
  }
}

function TokenDetail({ token, rates }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <div className="flex items-center">
        <h1 className="mr-3">{token.name}</h1>
        <span className="text-gray-600">${token.symbol}</span>
      </div>
      <div>
        <Chart data={rates} isIncrease={true} />
      </div>
    </>
  )
}

export default TokenDetail
