import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import Link from "next/link";
import React, { useEffect, useMemo } from "react";
import { Clipboard } from "react-feather";
import { useSelector } from "react-redux";
import {
  AccountState,
  Currency,
  CurrencyState,
  RootState,
  StakingState,
  TokenState,
} from "store/types";
import { shortenAddress } from "utils/shorten";
import BigNumber from "bignumber.js";
import { toBigNumber } from "utils/useMoneyFormatter";
import { cryptoFormat } from "utils/format";
import { BIG_ZERO } from "utils/strings";
import { filter } from "underscore";
import { computeDelegRewards } from "utils/rewardCalculator";
import { BN, fromBech32Address } from "@zilliqa-js/zilliqa";

const StakingAccount = () => {
  const accountState = useSelector<RootState, AccountState>(
    (state) => state.account
  );
  const tokenState = useSelector<RootState, TokenState>((state) => state.token);
  const stakingState = useSelector<RootState, StakingState>(
    (state) => state.staking
  );
  const currencyState = useSelector<RootState, CurrencyState>(
    (state) => state.currency
  );
  const selectedCurrency: Currency = currencyState.currencies.find(
    (currency) => currency.code === currencyState.selectedCurrency
  )!;
  const { resolvedTheme } = useTheme();
  const router = useRouter();

  const zilBalance = useMemo(() => {
    if (!tokenState.initialized) return new BigNumber(0);
    const zilToken = tokenState.tokens.find((token) => token.symbol === "ZIL");
    return toBigNumber(zilToken?.balance, { compression: zilToken?.decimals });
  }, [accountState.selectedWallet]);

  const filteredOperators = useMemo(() => {
    if (!tokenState.initialized) return [];

    let filtered = stakingState.operators.filter((operator) => {
      return operator.symbol == "ZIL" && !toBigNumber(operator.staked).isZero();
    });

    filtered.sort((a, b) => {
      let beforeStaked = a.staked ?? new BigNumber(0);
      let afterStaked = b.staked ?? new BigNumber(0);
      return beforeStaked.isLessThan(afterStaked) ? 1 : -1;
    });

    return filtered;
  }, [stakingState.operators]);

  useEffect(() => {
    calculateRewards();
  }, [accountState.selectedWallet, stakingState.initialized]);

  const calculateRewards = async () => {
    if (!accountState.selectedWallet || !stakingState.initialized) return;

    filteredOperators.forEach(async (operator) => {
      const delegRewards: BN | undefined = await computeDelegRewards(
        operator.address,
        fromBech32Address(accountState.selectedWallet!.address)
      );
      console.log(delegRewards);
      if (delegRewards) {
        const rewards = new BigNumber(delegRewards.toString());
        console.log(rewards.toString());
      }
    });
  };

  if (!accountState.selectedWallet) return <></>;

  return (
    <>
      <div className="pt-6 pb-6 flex items-center">
        <div className="flex-grow flex items-center">
          <div className="border-2 border-gray-300 dark:border-gray-600 p-px rounded-full mr-3">
            <div className="w-12 h-12 bg-primary rounded-full"></div>
          </div>
          <div>
            <div className="text-xl font-bold">
              {shortenAddress(accountState.selectedWallet.address)}
            </div>
            <div className="flex items-center text-gray-500">
              <div className="mr-2">
                {cryptoFormat(zilBalance.toNumber())} ZIL
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="block bg-primary dark:bg-primary-dark font-medium rounded-lg h-10 py-1 px-4">
            Stake
          </button>
        </div>
      </div>
      <div className="flex items-center border-b border-gray-300 dark:border-gray-700 font-medium mb-2">
        <div className="text-gray-500 dark:border-gray-700 border-opacity-0">
          Active stakes
        </div>
      </div>
      <div className="scrollable-table-container max-w-full overflow-x-scroll">
        <table className="zilstream-table table-fixed border-collapse">
          <colgroup>
            <col style={{ width: "200px", minWidth: "auto" }} />
            <col style={{ width: "120px", minWidth: "auto" }} />
            <col style={{ width: "120px", minWidth: "auto" }} />
            <col style={{ width: "120px", minWidth: "auto" }} />
          </colgroup>
          <thead className="text-gray-500 dark:text-gray-400 text-xs">
            <tr>
              <th className="pl-5 pr-2 py-2 text-left">SSN</th>
              <th className="px-2 py-2 text-right">Amount</th>
              <th className="px-2 py-2 text-right">Rewards</th>
              <th className="px-2 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOperators.map((operator, index) => {
              let staked = operator.staked ?? BIG_ZERO;
              return (
                <tr
                  key={operator.address}
                  role="row"
                  className="text-sm border-b dark:border-gray-700 last:border-b-0"
                >
                  <td
                    className={`pl-5 pr-2 py-4 font-medium ${
                      index === 0 ? "rounded-tl-lg" : ""
                    } ${
                      index === filteredOperators.length - 1
                        ? "rounded-bl-lg"
                        : ""
                    }`}
                  >
                    {operator.name}
                  </td>
                  <td className="px-2 py-4 font-normal text-right">
                    {cryptoFormat(staked.shiftedBy(-12).toNumber())} ZIL
                  </td>
                  <td className="px-2 py-4 font-normal text-right"></td>
                  <td
                    className={`pl-2 pr-3 py-4 text-right ${
                      index === 0 ? "rounded-tr-lg" : ""
                    } ${
                      index === filteredOperators.length - 1
                        ? "rounded-br-lg"
                        : ""
                    }`}
                  ></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default StakingAccount;
