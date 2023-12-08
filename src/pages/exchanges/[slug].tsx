import TokenIcon from "components/TokenIcon";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Currency, CurrencyState, RootState, TokenState } from "store/types";
import { cryptoFormat, currencyFormat, numberFormat } from "utils/format";
import { Exchange } from "types/exchange.interface";
import getExchange from "lib/zilstream/getExchange";
import { Pair } from "types/pair.interface";
import { Link as WebLink } from "react-feather";
import CopyableAddress from "components/CopyableAddress";
import EmptyRow from "components/EmptyRow";
import { ZIL_ADDRESS } from "lib/constants";
import { useRouter } from "next/router";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { slug } = context.query;

  var fetchedExchange: Exchange | null = null;

  try {
    fetchedExchange = await getExchange(slug as string);
  } catch {
    fetchedExchange = null;
  }

  return {
    props: {
      fetchedExchange,
    },
  };
};

const ExchangeDetail = ({
  fetchedExchange,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { slug } = router.query;
  const tokenState = useSelector<RootState, TokenState>((state) => state.token);
  const currencyState = useSelector<RootState, CurrencyState>(
    (state) => state.currency
  );
  const selectedCurrency: Currency = currencyState.currencies.find(
    (currency) => currency.code === currencyState.selectedCurrency
  )!;
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [totalVolume, setTotalVolume] = useState<number>(0);
  const [totalLiquidity, setTotalLiquidity] = useState<number>(0);
  const [exchange, setExchange] = useState<Exchange | null>(fetchedExchange);

  useEffect(() => {
    const fetchExchange = async () => {
      const fetchedExchange = await getExchange(slug as string);
      setExchange(fetchedExchange);
    };

    if (!exchange) {
      fetchExchange();
    }
  }, []);

  useEffect(() => {
    if (!exchange) return;

    const liquidity = exchange.pairs.reduce((sum, pair) => {
      const quoteToken = tokenState.tokens.filter(
        (token) => token.address === pair.quote_address
      )?.[0];
      var liquidity = (pair.quote_reserve ?? 0) * 2;
      if (!quoteToken?.isZil) {
        liquidity =
          (pair.quote_reserve ?? 0) *
          (quoteToken?.market_data.rate_zil ?? 0) *
          2;
      }
      return sum + liquidity;
    }, 0);
    setTotalLiquidity(liquidity);

    let volume = exchange.pairs.reduce((sum, pair) => {
      if (pair.volume && (pair.volume_24h_quote ?? 0) > 0) {
        const quoteToken = tokenState.tokens.filter(
          (token) => token.address === pair.quote_address
        )?.[0];
        if (quoteToken && quoteToken.isZil) {
          return sum + (pair.volume_24h_quote ?? 0);
        } else {
          return (
            sum +
            (pair.volume_24h_quote ?? 0) *
              (quoteToken?.market_data.rate_zil ?? 0)
          );
        }
      }
      return sum;
    }, 0);
    setTotalVolume(volume);

    const filteredPairs = exchange.pairs.filter((pair) => {
      const token = tokenState.tokens.filter(
        (token) => token.address === pair.base_address
      )?.[0];
      return token?.reviewed || token?.address === ZIL_ADDRESS;
    });
    filteredPairs.sort((a, b) => {
      return (a.volume_24h_quote ?? 0) > (b.volume_24h_quote ?? 0) ? -1 : 1;
    });
    setPairs(filteredPairs);
  }, [tokenState, exchange]);

  if (!exchange) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Exchanges | ZilStream</title>
        <meta property="og:title" content={`Exchanges | ZilStream`} />
      </Head>
      <div className="pt-8 pb-2 md:pb-8">
        <div className="flex flex-col lg:flex-row items-start">
          <div className="flex-grow">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center">
                <TokenIcon url={exchange.icon} />
              </div>
              <h1 className="mb-1">{exchange.name}</h1>
            </div>
            <div className="mt-3 flex items-center text-gray-800 dark:text-gray-200 text-sm">
              <a
                href={exchange.website}
                target="_blank"
                className="inline-flex font-medium items-center mr-2 bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 px-2 py-1 rounded"
              >
                <WebLink size={12} className="mr-1" />
                Website
              </a>

              {exchange.address && (
                <div>
                  <CopyableAddress address={exchange.address} showCopy={true} />
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="text-sm flex md:text-right">
              <div className="py-2 border-r border-gray-300 dark:border-gray-800 mr-10 pr-8">
                <div className="text-gray-700 dark:text-gray-400">
                  Liquidity
                </div>
                <div className="font-medium">
                  {currencyFormat(
                    totalLiquidity * selectedCurrency.rate,
                    selectedCurrency.symbol
                  )}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {cryptoFormat(totalLiquidity)} ZIL
                </span>
              </div>
              <div className="py-2 border-gray-300 dark:border-gray-800">
                <div className="text-gray-700 dark:text-gray-400 ">
                  Volume (24h)
                </div>
                <div className="font-medium">
                  {currencyFormat(
                    totalVolume * selectedCurrency.rate,
                    selectedCurrency.symbol
                  )}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {cryptoFormat(totalVolume)} ZIL
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="scrollable-table-container max-w-full overflow-x-scroll">
        <table className="zilstream-table table-fixed border-collapse">
          <colgroup>
            <col style={{ width: "500px", minWidth: "auto" }} />
            <col style={{ width: "180px", minWidth: "auto" }} />
            <col style={{ width: "180px", minWidth: "auto" }} />
            <col style={{ width: "180px", minWidth: "auto" }} />
            <col style={{ width: "180px", minWidth: "auto" }} />
          </colgroup>
          <thead className="text-gray-500 dark:text-gray-400 text-xs">
            <tr>
              <th className="pl-3 pr-2 py-2 text-left">Token</th>
              <th className="px-2 py-2 text-left">Pair</th>
              <th className="px-2 py-2 text-right">Price</th>
              <th className="px-2 py-2 text-right">Liquidity</th>
              <th className="px-2 py-2 text-right">Volume (24h)</th>
              <th className="px-2 py-2 text-right">Volume %</th>
            </tr>
          </thead>
          <tbody>
            {pairs.map((pair: Pair, index: number) => {
              const baseToken = tokenState.tokens.filter(
                (token) => token.address === pair.base_address
              )?.[0];
              const quoteToken = tokenState.tokens.filter(
                (token) => token.address === pair.quote_address
              )?.[0];

              var liquidity = (pair.quote_reserve ?? 0) * 2;
              var volume = pair.volume_24h_quote ?? 0;
              if (!quoteToken.isZil) {
                liquidity =
                  (pair.quote_reserve ?? 0) *
                  quoteToken.market_data.rate_zil *
                  2;
                volume =
                  (pair.volume_24h_quote ?? 0) *
                  quoteToken.market_data.rate_zil;
              }

              return (
                <tr
                  key={pair.base_address}
                  role="row"
                  className="text-sm border-b dark:border-gray-700 last:border-b-0 whitespace-nowrap"
                >
                  <td
                    className={`pl-4 pr-2 py-4 flex items-center font-medium ${
                      index === 0 ? "rounded-tl-lg" : ""
                    } ${
                      index === exchange.pairs.length - 1 ? "rounded-bl-lg" : ""
                    }`}
                  >
                    <Link href={`/tokens/${pair.base_symbol.toLowerCase()}`}>
                      <a className="flex items-center">
                        <div className="w-6 h-6 flex-shrink-0 flex-grow-0 mr-3">
                          <TokenIcon address={pair.base_address} />
                        </div>
                        <span className="hidden lg:inline whitespace-nowrap">
                          {baseToken?.name}
                        </span>
                        <span className="lg:font-normal ml-2 lg:text-gray-500 whitespace-nowrap">
                          {pair.base_symbol}
                        </span>
                      </a>
                    </Link>
                  </td>
                  <td className="px-2 py-2 font-normal text-left">
                    {pair.pair}
                  </td>
                  <td className="px-2 py-2 font-normal text-right">
                    <div>
                      {cryptoFormat(
                        (pair.price ?? 0) * quoteToken.market_data.rate_zil
                      )}{" "}
                      ZIL
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {cryptoFormat(pair.price ?? 0)} {pair.quote_symbol}
                    </div>
                  </td>
                  <td className="px-2 py-2 font-normal text-right">
                    {currencyFormat(
                      (liquidity ?? 0) * selectedCurrency.rate,
                      selectedCurrency.symbol
                    )}
                  </td>
                  <td className="px-2 py-2 font-normal text-right">
                    {currencyFormat(
                      (volume ?? 0) * selectedCurrency.rate,
                      selectedCurrency.symbol
                    )}
                  </td>
                  <td
                    className={`pl-2 pr-3 py-2 text-right ${
                      index === 0 ? "rounded-tr-lg" : ""
                    } ${
                      index === exchange.pairs.length - 1 ? "rounded-br-lg" : ""
                    }`}
                  >
                    {totalVolume === 0 ? (
                      <>0%</>
                    ) : (
                      <>{numberFormat((volume / totalVolume) * 100)}%</>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {pairs.length === 0 && (
          <EmptyRow message="This exchange doesn't have any pairs yet." />
        )}
      </div>
    </>
  );
};

export default ExchangeDetail;
