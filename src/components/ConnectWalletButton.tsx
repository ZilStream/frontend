interface Props {
  walletName: string,
  connectWallet: () => Promise<void>
}

const ConnectWalletButton = (props: Props) => (
    <button
      className="bg-gray-300 dark:bg-gray-800 py-3 px-6 rounded-full font-medium focus:outline-none"
      onClick={() => props.connectWallet()}
    >{props.walletName}</button>
);

export default ConnectWalletButton;
