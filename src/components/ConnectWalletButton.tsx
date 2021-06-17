interface Props {
  walletName: string,
  connectWallet: React.MouseEventHandler<HTMLButtonElement>
}

const ConnectWalletButton = (props: Props) => (
    <button
      className="bg-gray-300 dark:bg-gray-700 py-2 px-6 rounded-lg font-medium focus:outline-none"
      onClick={props.connectWallet}
    >{props.walletName}</button>
);

export default ConnectWalletButton;
