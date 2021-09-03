import BigNumber from "bignumber.js";
import { AccountType } from "types/walletType.interface";

export interface AccountState {
  initialized: boolean,
  network: Network,
  wallets: ConnectedWallet[],
  selectedWallet: ConnectedWallet|null
}

export interface ConnectedWallet {
  address: string,
  label: string,
  isDefault: boolean,
  isConnected: boolean,
  type: AccountType
}

export interface AddWalletProps {
  wallet: ConnectedWallet
}