import { Zilliqa } from "@zilliqa-js/zilliqa";
import getZilRates from "lib/coingecko/getZilRates";
import { STREAM_ADDRESS, ZIL_ADDRESS } from "lib/constants";
import getCollectionsOwnerStates from "lib/zilstream/getCollectionsOwnerStates";
import getCollectionsOwnerState from "lib/zilstream/getCollectionsOwnerStates";
import getNftCollections from "lib/zilstream/getNftCollections";
import getPortfolioState from "lib/zilstream/getPortfolio";
import getTokens from "lib/zilstream/getTokens";
import getTokensFromCollectionsOwnerStates from "lib/zilstream/getTokensFromCollectionsOwnerState";
import React, { useEffect, useState } from "react";
import { batch, useDispatch, useSelector, useStore } from "react-redux";
import { startSagas } from "saga/saga";
import { AccountActionTypes, updateWallet } from "store/account/actions";
import { setAlertState, updateAlert } from "store/alert/actions";
import { CollectionActionTypes } from "store/collection/actions";
import { CurrencyActionTypes } from "store/currency/actions";
import {
  setNotificationState,
  updateNotification,
} from "store/notification/actions";
import { updateSettings } from "store/settings/actions";
import { updateSwap } from "store/swap/actions";
import { TokenActionTypes } from "store/token/actions";
import {
  AccountState,
  AlertState,
  BlockchainState,
  CollectionState,
  NftToken,
  NotificationState,
  RootState,
  SettingsState,
  StakingState,
  SwapState,
  Token,
  TokenState,
} from "store/types";
import { Indicator, Metric } from "types/metric.interface";
import { AccountType } from "types/walletType.interface";
import { getTokenAPR } from "utils/apr";
import {
  BatchResponse,
  sendBatchRequest,
  stakingDelegatorsBatchRequest,
} from "utils/batch";
import { cryptoFormat, currencyFormat } from "utils/format";
import { useInterval } from "utils/interval";
import { processBatch } from "utils/processBatch";

interface Props {
  children: React.ReactNode;
}

const StateProvider = (props: Props) => {
  const blockchainState = useSelector<RootState, BlockchainState>(
    (state) => state.blockchain
  );
  const accountState = useSelector<RootState, AccountState>(
    (state) => state.account
  );
  const tokenState = useSelector<RootState, TokenState>((state) => state.token);
  const collectionState = useSelector<RootState, CollectionState>(
    (state) => state.collection
  );
  const stakingState = useSelector<RootState, StakingState>(
    (state) => state.staking
  );
  const settingsState = useSelector<RootState, SettingsState>(
    (state) => state.settings
  );
  const swapState = useSelector<RootState, SwapState>((state) => state.swap);
  const alertState = useSelector<RootState, AlertState>((state) => state.alert);
  const notificationState = useSelector<RootState, NotificationState>(
    (state) => state.notification
  );
  const dispatch = useDispatch();
  const [stakingLoaded, setStakingLoaded] = useState(false);
  const zilliqa = new Zilliqa("https://api.zilliqa.com");

  async function loadTokens() {
    var tokens = await getTokens();
    if (tokens.length === 0) return;

    tokens = tokens.filter(
      (token) => token.address === ZIL_ADDRESS || token.reviewed
    );

    batch(() => {
      if (!tokenState.initialized) {
        for (let i = 0; i < tokens.length; i++) {
          tokens[i].isZil = tokens[i].address === ZIL_ADDRESS;
          tokens[i].isStream = tokens[i].address === STREAM_ADDRESS;
        }
        dispatch({ type: TokenActionTypes.TOKEN_INIT, payload: { tokens } });
      } else {
        tokens.forEach((token) => {
          const { address, ...tokenDetails } = token;
          dispatch({
            type: TokenActionTypes.TOKEN_UPDATE,
            payload: {
              address: address,
              ...tokenDetails,
            },
          });
        });
      }
    });

    processAlerts();
  }

  async function loadNftCollections() {
    let collections = await getNftCollections();
    dispatch({
      type: CollectionActionTypes.COLLECTION_INIT,
      payload: { collections },
    });
  }

  async function setFavorites() {
    const favoritesString = localStorage.getItem("favorites") ?? "";
    var favorites = favoritesString.split(",");

    batch(() => {
      favorites.forEach((address) => {
        dispatch({
          type: TokenActionTypes.TOKEN_UPDATE,
          payload: {
            address: address,
            isFavorited: true,
          },
        });
      });
    });
  }

  async function setTokenAPRs() {
    batch(() => {
      tokenState.tokens.forEach((token) => {
        const apr = getTokenAPR(token, tokenState);
        dispatch({
          type: TokenActionTypes.TOKEN_UPDATE,
          payload: {
            address: token.address,
            apr: apr,
          },
        });
      });
    });
  }

  async function loadZilRates() {
    const zilRates = await getZilRates();
    dispatch({
      type: CurrencyActionTypes.CURRENCY_UPDATE,
      payload: {
        code: "USD",
        rate: +zilRates.price,
      },
    });
    dispatch({
      type: CurrencyActionTypes.CURRENCY_SELECT,
      payload: { currency: "USD" },
    });
    // batch(() => {
    //   Object.entries(zilRates.zilliqa).map(([key, value]: [string, any]) => {
    //     dispatch({type: CurrencyActionTypes.CURRENCY_UPDATE, payload: {
    //       code: key.toUpperCase(),
    //       rate: value as number
    //     }})
    //   })

    //   dispatch({type: CurrencyActionTypes.CURRENCY_SELECT, payload: {currency: localStorage.getItem('selectedCurrency') ?? 'USD'}})
    // })
  }

  async function loadWalletState() {
    if (!accountState.selectedWallet || tokenState.initialized === false)
      return;
    let batchResults = await getPortfolioState(
      accountState.selectedWallet.address,
      tokenState.tokens,
      stakingState.operators
    );

    await processBatchResults(batchResults);
  }

  async function loadCollectionState() {
    if (!accountState.selectedWallet || collectionState.initialized === false)
      return;
    let ownerStates = await getCollectionsOwnerStates(
      collectionState.collections
    );
    let ownedTokens = await getTokensFromCollectionsOwnerStates(
      accountState.selectedWallet.address,
      ownerStates
    );

    batch(() => {
      collectionState.collections.forEach((collection) => {
        dispatch({
          type: CollectionActionTypes.COLLECTION_UPDATE,
          payload: {
            address: collection.address,
            tokens: [],
          },
        });
      });

      Object.keys(ownedTokens).forEach((address) => {
        var tokens: NftToken[] = [];
        ownedTokens[address].forEach((token) => {
          tokens.push({
            id: token,
          });
        });

        dispatch({
          type: CollectionActionTypes.COLLECTION_UPDATE,
          payload: {
            address: address,
            tokens: tokens,
          },
        });
      });
    });
  }

  async function fetchStakingState() {
    if (!accountState.selectedWallet) return;
    const walletAddress = accountState.selectedWallet.address;

    const batchRequests: any[] = [];
    stakingState.operators.forEach((operator) => {
      batchRequests.push(
        stakingDelegatorsBatchRequest(operator, walletAddress)
      );
    });
    let batchResults = await sendBatchRequest(batchRequests);
    await processBatchResults(batchResults);
  }

  async function processBatchResults(batchResults: BatchResponse[]) {
    if (!accountState.selectedWallet) return;
    const walletAddress = accountState.selectedWallet.address;

    processBatch(batchResults, walletAddress, dispatch);
  }

  async function loadSettings() {
    const settingsStr = localStorage.getItem("settings");

    if (settingsStr) {
      const settings: SettingsState = JSON.parse(settingsStr);
      dispatch(
        updateSettings({
          ...settings,
          initialized: true,
        })
      );
    } else {
      dispatch(
        updateSettings({
          initialized: true,
        })
      );
    }
  }

  async function loadAlerts() {
    const alertsStr = localStorage.getItem("alerts");

    if (alertsStr) {
      const alerts: AlertState = JSON.parse(alertsStr);
      dispatch(
        setAlertState({
          ...alerts,
          initialized: true,
        })
      );
    }
  }

  async function loadNotifications() {
    const notificationsStr = localStorage.getItem("notifications");

    if (notificationsStr) {
      const notifications: NotificationState = JSON.parse(notificationsStr);
      dispatch(
        setNotificationState({
          ...notifications,
          initialized: true,
        })
      );
    } else {
      dispatch(
        setNotificationState({
          notifications: [],
          initialized: true,
        })
      );
    }
  }

  async function checkPendingNotifications() {
    let pendingNotifications = notificationState.notifications.filter(
      (notification) => notification.status === "pending"
    );

    pendingNotifications.forEach(async (notification) => {
      let tx = await zilliqa.blockchain.getTransactionStatus(notification.hash);
      if (tx.status === 3) {
        // Tx confirmed
        dispatch(
          updateNotification({
            hash: notification.hash,
            status: "confirmed",
          })
        );
      } else if (tx.status >= 10) {
        // Tx rejected
        dispatch(
          updateNotification({
            hash: notification.hash,
            status: "rejected",
          })
        );
      }
    });
  }

  async function processAlerts() {
    // Return early if the notification permission isn't granted.
    if (Notification.permission !== "granted") return;

    let alerts = alertState.alerts;
    alerts.forEach((alert) => {
      // Check if the alert has already been triggered, if the case skip it immediately.
      if (alert.triggered) return;

      let token = tokenState.tokens.filter(
        (token) => token.address === alert.token_address
      )?.[0];
      let currentRate =
        alert.metric === Metric.PriceZIL
          ? token.market_data.rate_zil
          : token.market_data.rate_usd;
      let targetRate = alert.value;

      if (alert.indicator === Indicator.Above) {
        if (currentRate >= targetRate) {
          dispatch(
            updateAlert({
              previous: alert,
              triggered: true,
            })
          );
          sendPriceNotificationForToken(token);
        }
      } else if (alert.indicator === Indicator.Below) {
        dispatch(
          updateAlert({
            previous: alert,
            triggered: true,
          })
        );

        if (currentRate <= targetRate) {
          sendPriceNotificationForToken(token);
        }
      }
    });

    function sendPriceNotificationForToken(token: Token) {
      new Notification(
        `${token.symbol}: ${cryptoFormat(
          token.market_data.rate_zil
        )} ZIL (${currencyFormat(token.market_data.rate_usd)})`,
        {
          body: `${token.name}'s (${
            token.symbol
          }) current price is ${cryptoFormat(
            token.market_data.rate_zil
          )} ZIL (${currencyFormat(token.market_data.rate_usd)}).`,
          icon: token.icon,
        }
      );
    }
  }

  useInterval(async () => {
    loadZilRates();
  }, 20000);

  useEffect(() => {
    if (!tokenState.initialized) return;
    loadTokens();
    loadWalletState();
    checkPendingNotifications();
  }, [blockchainState.blockHeight]);

  useEffect(() => {
    loadSettings();
    loadAlerts();
    loadNotifications();
    loadTokens();
    loadZilRates();
    loadNftCollections();

    startSagas();
  }, []);

  useEffect(() => {
    if (!tokenState.initialized) return;
    setFavorites();
    setTokenAPRs();
  }, [tokenState.initialized]);

  useEffect(() => {
    if (!collectionState.initialized || !accountState.selectedWallet) return;
    loadCollectionState();
  }, [collectionState.initialized, accountState.selectedWallet]);

  useEffect(() => {
    if (!tokenState.initialized || !accountState.selectedWallet) return;
    loadWalletState();
  }, [accountState.selectedWallet, tokenState.initialized]);

  useEffect(() => {
    if (stakingState.operators.length === 0 || stakingLoaded) return;
    setStakingLoaded(true);
    fetchStakingState();
  }, [stakingState]);

  useEffect(() => {
    if (!accountState.initialized) return;
    // This makes sure all account changes persist.
    localStorage.setItem("account", JSON.stringify(accountState));
  }, [accountState]);

  useEffect(() => {
    if (!alertState.initialized) return;
    localStorage.setItem("alerts", JSON.stringify(alertState));
  }, [alertState]);

  useEffect(() => {
    if (!notificationState.initialized) return;
    localStorage.setItem("notifications", JSON.stringify(notificationState));
  }, [notificationState]);

  useEffect(() => {
    const accountString = localStorage.getItem("account");
    if (accountString) {
      const account: AccountState = JSON.parse(accountString);
      account.initialized = true;
      account.wallets = account.wallets.map((a) => ({
        ...a,
        isConnected: false,
      }));

      dispatch({ type: AccountActionTypes.INIT_ACCOUNT, payload: account });

      if (
        account.wallets.filter((a) => a.type === AccountType.ZilPay).length > 0
      ) {
        // Has Zil Pay wallet, try to connect
        connectZilPay();
      }
    } else {
      dispatch({
        type: AccountActionTypes.INIT_ACCOUNT,
        payload: {
          initialized: true,
          network: "mainnet",
          wallets: [],
          selectedWallet: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (!settingsState.initialized) return;
    localStorage.setItem("settings", JSON.stringify(settingsState));
  }, [settingsState]);

  if (typeof window !== "undefined") {
    // @ts-ignore
    import("zeeves-auth-sdk-js");
  }

  const connectZilPay = async () => {
    const zilPay = (window as any).zilPay;

    // Check if ZilPay is installed
    if (typeof zilPay === "undefined") {
      console.log("ZilPay extension not installed");
      return;
    }

    const result = await zilPay.wallet.connect();

    if (result !== zilPay.wallet.isConnect) {
      console.log("Could not connect to ZilPay");
      return;
    }

    const walletAddress = zilPay.wallet.defaultAccount.bech32;
    dispatch(updateWallet({ address: walletAddress, isConnected: true }));
  };

  return <>{props.children}</>;
};

export default StateProvider;
