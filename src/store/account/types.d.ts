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
  isMember: boolean,
  type: AccountType
  provider?: any
}

export interface AddWalletProps {
  wallet: ConnectedWallet
}

export interface UpdateWalletProps extends Partial<ConnectedWallet> {
  address: string
}

export interface SelectWalletProps {
  wallet: ConnectedWallet
}