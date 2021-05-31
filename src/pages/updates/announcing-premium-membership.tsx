import React from 'react'
import Head from 'next/head'
import Image from 'next/image'

function PremiumMembership() {
  return (
    <>
      <Head>
        <title>Announcing Premium Membership | ZilStream</title>

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@zilstream" />
        <meta name="twitter:title" content="Announcing Premium Membership | ZilStream" />
        <meta name="twitter:description" content="Introducing ZilStream Premium Membership, Portfolio and STREAM token." />
        <meta name="twitter:image" content="https://zilstream.com/images/zilstream-banner.png" />

        <meta property="og:url" content="https://zilstream.com/updates/announcing-premium-membership" key="ogurl" />
        <meta property="og:image" content="https://zilstream.com/images/zilstream-banner.png" key="ogimage" />
        <meta property="og:site_name" content="ZilStream" key="ogsitename" />
        <meta property="og:title" content="Announcing Premium Membership | ZilStream" />
        <meta property="og:description" content="Introducing ZilStream Premium Membership, Portfolio and STREAM token." key="ogdesc" />
      </Head>
      <div className="max-w-3xl mx-auto pt-20 pb-12 text-center">
        <Image 
          src="/images/zilstream-banner.png"
          alt="ZilStream"
          width={800}
          height={385}
          className="rounded-lg"
        />
        <h1 className="mt-20 mb-1">Announcing Premium Membership</h1>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 sm:p-10 rounded-lg max-w-3xl mx-auto text-lg">
        <p className="mb-6">Since the launch of ZilStream investors in the Zilliqa ecosystem have had much better insight into the ZRC-2 market activity. The site has now been visited over 4,000,000 times. For that we’d like to thank the Zilliqa community for the warm welcome, it’s been wild ride and it’s only gonna get better.</p>
        <p className="mb-6">Today, we're pleased to announce the upcoming ZilStream Premium Membership. The best way to get deep insight into the market and your position within it. Starting with Portfolio, which launches in public beta today.</p>

        <h2 className="text-2xl text-center mt-16 mb-4">Portfolio</h2>
        <p className="mb-6">With Portfolio you’ll be able to see all the tokens you’re currently holding in your wallet, what each of those assets is worth, and your total net worth. Updated live as new balance and price updates come in. All with the speed and clean UI you’re used to from ZilStream.</p>
        <p className="mb-6">Tracking your portfolio is as easy. Just connect your wallet (ZilPay or Zeeves). From there you’ll be taken to a complete and fully featured dashboard with a complete breakdown of the wallet. Including your Balances, Liquidity Pools, Staking and more.</p>
        <h3 className="text-xl text-center mb-4 mt-8">Features</h3>
        <p className="mb-6">Starting today you'll be able to use some features of Portfolio for free. This includes tracking of your balances, liquidity pools you've entered and ZIL you've staked at the various staking node operators. When Premium Membership launches later this quarter, ZilStream Premium members will be able to enjoy many additional features, most of which will be available at launch.</p>
        <ul className="list-disc ml-6 mb-6">
          <li>Tracking of 0.3% fees earned in Liquidity Pools.</li>
          <li>Tracking of earned staking rewards.</li>
          <li>Tracking of your Pillar loans.</li>
          <li>Changing the default currency from USD to EUR, SGD and many more.</li>
          <li>Detailed timeline of all your transaction, filterable in many ways.</li>
          <li>Support for multiple wallets (eg. cold + hot wallet).</li>
          <li>Support for tracking LP/Staking rewards other than ZWAP.</li>
          <li>Price alerts for all ZRC-2 tokens.</li>
          <li>Exporting transactions to Excel.</li>
        </ul>
        <p className="mb-6">We'll be continuously working on expanding Premium Membership features in the future. Such as features aren't limited just to Portfolio. One of the first Premium features that will be launching outside of Portfolio is a full screen chart that includes various indicators and drawing tools.</p>
        <h2 className="text-2xl text-center mt-16 mb-4">ZilStream Premium Membership</h2>
        <p className="mb-6">With Premium, members will be able to enjoy additional features and benefits on ZiLStream. Starting with a detailed Portfolio, but expanding to more features in the near future. Central to the membership is the launch of ZilStream's very own token named <strong>STREAM</strong>, which will be launching later this quarter.</p>

        <p className="mb-6">To become a Premium member users will have to hold $1 of <strong>STREAM</strong> for every $200 of value in their wallet. So the cost of the product scales with the investor and incentivizes holding of the token.</p>

        <h3 className="text-xl text-center mb-4 mt-8">STREAM Token</h3>
        <p className="mb-6">Stream will have a fixed total supply of <strong>20,000,000 STREAM</strong>, of which <strong>3,800,000 STREAM</strong> will be circulating at launch. Decimals will be set at 8.</p>

        <h3 className="text-xl text-center mb-4 mt-8">Tokenomics</h3>
        <ul className="list-disc ml-6 mb-6">
          <li>Initial sale (12%): <strong>2,400,000</strong></li>
          <li>Private sale (20%): <strong>4,000,000</strong> (Vested quarterly over 12 months)</li>
          <li>Initial liquidity (3%): <strong>600,000</strong></li>
          <li>Liquidity rewards (25%): <strong>5,000,000</strong> (Linear curve over 4 years)</li>
          <li>Marketing & Operations (20%): <strong>4,000,000</strong> (Vested quarterly over 24 months)</li>
          <li>Founders (10%): <strong>2,000,000</strong> (Vested quarterly over 24 months)</li>
          <li>Team (10%): <strong>2,000,000</strong> (Vested quarterly over 24 months)</li>
        </ul>

        <h3 className="text-xl text-center mb-4 mt-8">Initial Sale</h3>
        <p className="mb-6">The initial sale price is set at <strong>$0.10 / STREAM</strong>. The private sale price was set at <strong>$0.065 / STREAM</strong>, this sale has been closed and was led by ZILHive. More details on the initial sale will be made available in the near future.</p>

        <h3 className="text-xl text-center mb-4 mt-8">Disclaimer</h3>
        <p className="mb-6">The <strong>STREAM</strong> token is neither a security nor an asset. It doesn't have any value outside being a proof of membership for the services provided on zilstream.com. We don't promise any returns. Cryptocurrencies are highly volatile and can lose all their value at any point.</p>
        <p className="mb-6">The information provided on ZilStream is not investment advice, trading advice or any other sort of advice and you should not treat any of the website's content as such. ZilStream does not recommend that any cryptocurrency should be bought, sold, or held by you. Do conduct your research and consult your financial advisor before making any investment decisions.</p>
        <p className="mb-6">Tokens and all other information displayed on ZilStream does not constitute an endorsement, guarantee, warranty or recommendation by ZilStream.</p>
        <p className="mb-6">ZilStream strives to accurately display information, but does not hold any responsibility for wrong or missing information. Information is provided as is, and it should be used at your own risk.</p>

        <div className="text-center">
          <h2 className="text-2xl text-center mt-16 mb-4">Follow us for more updates</h2>
          <p>Twitter: <a href="https://twitter.com/zilstream">@zilstream</a></p>
          <p>Telegram: <a href="https://t.me/zilstream">@zilstream</a></p>
        </div>
      </div>
    </>
  )
}

export default PremiumMembership