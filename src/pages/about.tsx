import Head from "next/head";
import React from "react";

function ApiTerms() {
  return (
    <>
      <Head>
        <title>About ZilStream</title>
        <meta property="og:title" content="About | ZilStream" />
      </Head>
      <div className="py-8 text-center">
        <h1 className="mb-1">About ZilStream</h1>
      </div>
      <div className="max-w-2xl mx-auto text-sm">
        <div className="mb-6">
          <p className="mb-4">
            ZilStream's is the Zilliqa ecosystem's leading market tracking and
            data provider. Empowering the Zilliqa community with the most
            accurate and up-to-date market data, news, and insights.
          </p>

          <p className="mb-4">
            Founded in February 2021, ZilStream has served millions of users
            directly and through its API. ZilStream's API is used by developers,
            traders, and businesses to access real-time and historical market
            data, news, and insights.
          </p>

          <h3 className="mb-2 mt-8">TradingView Charts</h3>
          <p>
            Zilstream uses TradingView technology to display price on charts.
            TradingView is a charting platform for a global community of traders
            and investors. Supercharged by robust technologies across browser,
            desktop and mobile apps, the platform provides unparalleled access
            to live data e.g. BTC USD Chart, the latest news, financial reports,
            Stock screener and Economic calendar.
          </p>
        </div>
      </div>
    </>
  );
}

export default ApiTerms;
