import BigNumber from "bignumber.js";
import { Token } from "store/types";
import { ExchangeRate, TxParams } from "./types";
import { Contract, Value, CallParams } from '@zilliqa-js/contract';
import { Transaction } from '@zilliqa-js/account'
import { BN, Long, units } from '@zilliqa-js/util'
import { fromBech32Address } from "@zilliqa-js/crypto";
import { Zilliqa } from "@zilliqa-js/zilliqa";
import { toBigNumber } from "utils/useMoneyFormatter";
import { BIG_ZERO } from "utils/strings";

export abstract class Exchange {
  readonly zilliqa: Zilliqa;
  readonly provider: any;

  abstract readonly contractAddress: string;
  abstract readonly contractHash: string;
  abstract readonly contract: Contract;

  readonly walletAddress: string;
  readonly walletHash: string;
  
  walletBalance: BigNumber;

  readonly txParams: TxParams = {
    version: -1,
    gasPrice: new BN(0),
    gasLimit: Long.fromNumber(5000),
    nonce: 0
  }
  
  constructor(zilliqa: Zilliqa, provider: any) {
    this.zilliqa = zilliqa;
    this.provider = provider;

    this.walletAddress = this.provider.wallet.defaultAccount.bech32
    this.walletHash = fromBech32Address(this.walletAddress).toLowerCase()
    this.walletBalance = new BigNumber(0)

    this.initialize()
  }

  private async initialize() {
    if (this.txParams.gasPrice.isZero()) {
      const minGasPrice = await this.zilliqa.blockchain.getMinimumGasPrice()
      if (!minGasPrice.result) throw new Error('Failed to get min gas price.')
      this.txParams.gasPrice = new BN(minGasPrice.result)
    }

    const response = await this.zilliqa.blockchain.getBalance(this.walletHash)
    this.txParams.nonce = +response.result.nonce
    this.walletBalance = toBigNumber(response.result.balance)
  }

  abstract swap(tokenIn: Token, tokenOut: Token, amount: BigNumber, slippage: number, deadline: number, isIn: boolean): Promise<Transaction|null>;
  abstract getExchangeRate(tokenIn: Token, tokenOut: Token, amount: BigNumber, isIn: boolean): ExchangeRate;

  public async tokenNeedsApproval(token: Token, amount: BigNumber): Promise<{needsApproval: boolean, allowance: BigNumber}> {
    const tokenContract: Contract = this.provider.contracts.at(token.address)
    const tokenState = await tokenContract.getSubState('allowances', [this.walletHash, this.contractHash])
    const allowance = new BigNumber(tokenState?.allowances[this.walletHash]?.[this.contractHash] || 0)
    
    if(allowance.lt(amount)) {
      return {needsApproval: true, allowance: allowance}
    }
    return {needsApproval: false, allowance: BIG_ZERO}
  }

  public async approve(token: Token, amount: BigNumber): Promise<Transaction|null> {
    const approval = await this.tokenNeedsApproval(token, amount)
    if(approval.needsApproval) {
      try {
        const tokenContract: Contract = this.provider.contracts.at(token.address)
        const approveTxn = await this.callContract(
          tokenContract,
          'IncreaseAllowance',
          [
            {
              vname: 'spender',
              type: 'ByStr20',
              value: this.contractHash,
            },
            {
              vname: 'amount',
              type: 'Uint128',
              value: new BigNumber(2).pow(128).minus(1).minus(approval.allowance).toFixed(0),
            },
          ],
          {
            amount: new BN(0),
            ...this.txParams,
          },
          true
        )
        
        return approveTxn
      } catch (err) {
        throw err
      }
    }

    return null
  }

  public async callContract(
    contract: Contract,
    transition: string,
    args: Value[],
    params: CallParams,
    toDs?: boolean
  ): Promise<Transaction> {
    if (this.provider) {
      const txn = await (contract as any).call(transition, args, params, toDs)
      txn.id = txn.ID
      txn.isRejected = function (this: { errors: any[]; exceptions: any[] }) {
        return this.errors.length > 0 || this.exceptions.length > 0
      }
      return txn
    } else {
      return await contract.callWithoutConfirm(transition, args, params, toDs)
    }
  }
}