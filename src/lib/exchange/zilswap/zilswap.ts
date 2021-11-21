import { Token } from 'store/types'
import BigNumber from 'bignumber.js'
import { ZIL_ADDRESS } from 'lib/constants'
import { Exchange } from '../exchange'
import { ExchangeRate } from '../types'
import { Contract, Value, CallParams } from '@zilliqa-js/contract';
import { fromBech32Address } from '@zilliqa-js/crypto'
import { Zilliqa } from '@zilliqa-js/zilliqa'
import { Transaction } from '@zilliqa-js/account'
import { BN, Long, units } from '@zilliqa-js/util'

export class ZilSwap extends Exchange {
  readonly contractAddress: string;
  readonly contractHash: string;
  readonly contract: Contract;

  private static OUTPUT_AFTER_FEE = "9970"

  constructor(zilliqa: Zilliqa, provider: any) {
    super(zilliqa, provider)

    this.contractAddress = "zil1hgg7k77vpgpwj3av7q7vv5dl4uvunmqqjzpv2w"
    this.contractHash = fromBech32Address(this.contractAddress).toLowerCase()
    this.contract = this.provider.contracts.at(this.contractAddress)
  }

  public async swap(tokenIn: Token, tokenOut: Token, amount: BigNumber, slippage: number, daedline: number, isIn: boolean): Promise<Transaction|null> {
    if(isIn) {
      return this.swapExactInput(tokenIn, tokenOut, amount, slippage, daedline)
    }
    return this.swapExactOutput(tokenIn, tokenOut, amount, slippage, daedline)
  }

  private async swapExactInput(tokenIn: Token, tokenOut: Token, amount: BigNumber, slippage: number, deadline: number): Promise<Transaction|null> {
    const { expectedOutput } = this.getOutputs(tokenIn, tokenOut, amount)
    const minimumOutput = expectedOutput.minus(expectedOutput.times(slippage))

    let txn: { transition: string; args: Value[]; params: CallParams }

    if(tokenIn.address_bech32 === ZIL_ADDRESS) {
      // zil to zrc2
      txn = {
        transition: 'SwapExactZILForTokens',
        args: [
          {
            vname: 'token_address',
            type: 'ByStr20',
            value: fromBech32Address(tokenOut.address_bech32),
          },
          {
            vname: 'min_token_amount',
            type: 'Uint128',
            value: minimumOutput.toString(),
          },
          {
            vname: 'deadline_block',
            type: 'BNum',
            value: deadline.toString(),
          },
          {
            vname: 'recipient_address',
            type: 'ByStr20',
            value: this.walletHash,
          },
        ],
        params: {
          amount: new BN(amount.toString()),
          ...this.txParams,
        },
      }
    } else if(tokenOut.address_bech32 === ZIL_ADDRESS) {
      // zrc2 to zil
      txn = {
        transition: 'SwapExactTokensForZIL',
        args: [
          {
            vname: 'token_address',
            type: 'ByStr20',
            value: fromBech32Address(tokenIn.address_bech32),
          },
          {
            vname: 'token_amount',
            type: 'Uint128',
            value: amount.toString(),
          },
          {
            vname: 'min_zil_amount',
            type: 'Uint128',
            value: minimumOutput.toString(),
          },
          {
            vname: 'deadline_block',
            type: 'BNum',
            value: deadline.toString(),
          },
          {
            vname: 'recipient_address',
            type: 'ByStr20',
            value: this.walletHash,
          },
        ],
        params: {
          amount: new BN(0),
          ...this.txParams,
        },
      }
    } else {
      // zrc2 to zrc2
      txn = {
        transition: 'SwapExactTokensForTokens',
        args: [
          {
            vname: 'token0_address',
            type: 'ByStr20',
            value: fromBech32Address(tokenIn.address_bech32),
          },
          {
            vname: 'token1_address',
            type: 'ByStr20',
            value: fromBech32Address(tokenOut.address_bech32),
          },
          {
            vname: 'token0_amount',
            type: 'Uint128',
            value: amount.toString(),
          },
          {
            vname: 'min_token1_amount',
            type: 'Uint128',
            value: minimumOutput.toString(),
          },
          {
            vname: 'deadline_block',
            type: 'BNum',
            value: deadline.toString(),
          },
          {
            vname: 'recipient_address',
            type: 'ByStr20',
            value: this.walletHash,
          },
        ],
        params: {
          amount: new BN(0),
          ...this.txParams,
        },
      }
    }

    const swapTxn = await this.callContract(this.contract, txn.transition, txn.args, txn.params, true)

    if (swapTxn.isRejected()) {
      throw new Error('Submitted transaction was rejected.')
    }

    return swapTxn
  }

  private async swapExactOutput(tokenIn: Token, tokenOut: Token, amount: BigNumber, slippage: number, deadline: number): Promise<Transaction|null> {
    const { expectedInput } = this.getInputs(tokenIn, tokenOut, amount)
    const maximumInput = expectedInput.plus(expectedInput.times(slippage))

    let txn: { transition: string; args: Value[]; params: CallParams }

    if(tokenIn.address_bech32 === ZIL_ADDRESS) {
      // zil to zrc2
      txn = {
        transition: 'SwapZILForExactTokens',
        args: [
          {
            vname: 'token_address',
            type: 'ByStr20',
            value: fromBech32Address(tokenOut.address_bech32),
          },
          {
            vname: 'token_amount',
            type: 'Uint128',
            value: amount.toString(),
          },
          {
            vname: 'deadline_block',
            type: 'BNum',
            value: deadline.toString(),
          },
          {
            vname: 'recipient_address',
            type: 'ByStr20',
            value: this.walletHash,
          },
        ],
        params: {
          amount: new BN(maximumInput.toString()),
          ...this.txParams,
        },
      }
    } else if(tokenOut.address_bech32 === ZIL_ADDRESS) {
      // zrc2 to zil
      txn = {
        transition: 'SwapTokensForExactZIL',
        args: [
          {
            vname: 'token_address',
            type: 'ByStr20',
            value: fromBech32Address(tokenIn.address_bech32),
          },
          {
            vname: 'max_token_amount',
            type: 'Uint128',
            value: maximumInput.toString(),
          },
          {
            vname: 'zil_amount',
            type: 'Uint128',
            value: amount.toString(),
          },
          {
            vname: 'deadline_block',
            type: 'BNum',
            value: deadline.toString(),
          },
          {
            vname: 'recipient_address',
            type: 'ByStr20',
            value: this.walletHash,
          },
        ],
        params: {
          amount: new BN(0),
          ...this.txParams,
        },
      }
    } else {
      // zrc2 to zrc2
      txn = {
        transition: 'SwapTokensForExactTokens',
        args: [
          {
            vname: 'token0_address',
            type: 'ByStr20',
            value: fromBech32Address(tokenIn.address_bech32),
          },
          {
            vname: 'token1_address',
            type: 'ByStr20',
            value: fromBech32Address(tokenOut.address_bech32),
          },
          {
            vname: 'max_token0_amount',
            type: 'Uint128',
            value: maximumInput.toString(),
          },
          {
            vname: 'token1_amount',
            type: 'Uint128',
            value: amount.toString(),
          },
          {
            vname: 'deadline_block',
            type: 'BNum',
            value: deadline.toString(),
          },
          {
            vname: 'recipient_address',
            type: 'ByStr20',
            value: this.walletHash,
          },
        ],
        params: {
          amount: new BN(0),
          ...this.txParams,
        },
      }
    }

    const swapTxn = await this.callContract(this.contract, txn.transition, txn.args, txn.params, true)

    if (swapTxn.isRejected()) {
      throw new Error('Submitted transaction was rejected.')
    }

    return swapTxn
  }

  public getExchangeRate(tokenIn: Token, tokenOut: Token, amount: BigNumber, isIn: boolean): ExchangeRate {
    const queryFunction = isIn ? this.getRatesForInput.bind(this) : this.getRatesForOutput.bind(this)
    return queryFunction(tokenIn, tokenOut, amount)
  }

  private getRatesForInput(tokenIn: Token, tokenOut: Token, tokenInAmount: BigNumber): ExchangeRate {
    const { epsilonOutput, expectedOutput } = this.getOutputs(tokenIn, tokenOut, tokenInAmount)
    return {
      expectedAmount: expectedOutput,
      expectedSlippage: epsilonOutput.minus(expectedOutput).times(100).dividedBy(epsilonOutput).minus(0.3),
    }
  }

  private getRatesForOutput(tokenIn: Token, tokenOut: Token, tokenOutAmount: BigNumber): ExchangeRate {
    const { epsilonInput, expectedInput } = this.getInputs(tokenIn, tokenOut, tokenOutAmount)
    return {
      expectedAmount: expectedInput,
      expectedSlippage: expectedInput.minus(epsilonInput).times(100).dividedBy(expectedInput).minus(0.3),
    }
  }

  private getInputs(
    tokenIn: Token, 
    tokenOut: Token, 
    tokenOutAmount: BigNumber
  ): { epsilonInput: BigNumber; expectedInput: BigNumber } {
    let expectedInput: BigNumber // the expected amount after slippage and fees
    let epsilonInput: BigNumber // the zero slippage input
  
    if (tokenIn.address_bech32 === ZIL_ADDRESS) {
      // zil to zrc2
      const { zil_reserve, token_reserve } = tokenOut.market_data
      epsilonInput = tokenOutAmount.times(zil_reserve).dividedToIntegerBy(token_reserve)
      expectedInput = this.getInputFor(tokenOutAmount, zil_reserve, token_reserve)
    } else if (tokenOut.address_bech32 === ZIL_ADDRESS) {
      // zrc2 to zil
      const { zil_reserve, token_reserve } = tokenIn.market_data
      epsilonInput = tokenOutAmount.times(token_reserve).dividedToIntegerBy(zil_reserve)
      expectedInput = this.getInputFor(tokenOutAmount, token_reserve, zil_reserve)
    } else {
      // zrc2 to zrc2
      const { zil_reserve: zr1, token_reserve: tr1 } = tokenOut.market_data
      const intermediateEpsilonInput = tokenOutAmount.times(zr1).dividedToIntegerBy(tr1)
      const intermediateInput = this.getInputFor(tokenOutAmount, zr1, tr1)
  
      const { zil_reserve: zr2, token_reserve: tr2 } = tokenIn.market_data
      epsilonInput = intermediateEpsilonInput.times(tr2).dividedToIntegerBy(zr2)
      expectedInput = this.getInputFor(intermediateInput, tr2, zr2)
    }
  
    return { epsilonInput, expectedInput }
  }

  private getOutputs(
    tokenIn: Token, 
    tokenOut: Token, 
    tokenInAmount: BigNumber
  ): { epsilonOutput: BigNumber, expectedOutput: BigNumber } {
    let epsilonOutput: BigNumber // the zero slippage output
    let expectedOutput: BigNumber // the expected amount after slippage and fees
  
    if (tokenIn.address_bech32 === ZIL_ADDRESS) {
      // zil to zrc2
      const { zil_reserve, token_reserve } = tokenOut.market_data
      epsilonOutput = tokenInAmount.times(token_reserve).dividedToIntegerBy(zil_reserve)
      expectedOutput = this.getOutputFor(tokenInAmount, zil_reserve, token_reserve)
    } else if (tokenOut.address_bech32 === ZIL_ADDRESS) {
      // zrc2 to zil
      const { zil_reserve, token_reserve } = tokenIn.market_data
      epsilonOutput = tokenInAmount.times(zil_reserve).dividedToIntegerBy(token_reserve)
      expectedOutput = this.getOutputFor(tokenInAmount, token_reserve, zil_reserve)
    } else {
      // zrc2 to zrc2
      const { zil_reserve: zr1, token_reserve: tr1 } = tokenIn.market_data
      const intermediateEpsilonOutput = tokenInAmount.times(zr1).dividedToIntegerBy(tr1)
      const intermediateOutput = this.getOutputFor(tokenInAmount, tr1, zr1)
  
      const { zil_reserve: zr2, token_reserve: tr2 } = tokenOut.market_data
      epsilonOutput = intermediateEpsilonOutput.times(tr2).dividedToIntegerBy(zr2)
      expectedOutput = this.getOutputFor(intermediateOutput, zr2, tr2)
    }
  
    return { epsilonOutput, expectedOutput }
  }

  private getInputFor(
    outputAmount: BigNumber, 
    inputReserve: number, 
    outputReserve: number
  ): BigNumber {
    const input = new BigNumber(inputReserve)
    const output = new BigNumber(outputReserve)
    if (input.isZero() || output.isZero()) {
      throw new Error('Reserve has 0 tokens.')
    }
    if (output.lte(outputAmount)) {
      return new BigNumber('NaN')
    }
    const numerator = input.times(outputAmount).times(10000)
    const denominator = output.minus(outputAmount).times(ZilSwap.OUTPUT_AFTER_FEE)
    return numerator.dividedToIntegerBy(denominator).plus(1)
  }

  private getOutputFor(
    inputAmount: BigNumber, 
    inputReserve: number, 
    outputReserve: number
  ): BigNumber {
    const input = new BigNumber(inputReserve)
    const output = new BigNumber(outputReserve)
    if (input.isZero() || output.isZero()) {
      throw new Error('Reserve has 0 tokens.')
    }
    const inputAfterFee = inputAmount.times(ZilSwap.OUTPUT_AFTER_FEE)
    const numerator = inputAfterFee.times(output)
    const denominator = input.times(10000).plus(inputAfterFee)
    return numerator.dividedToIntegerBy(denominator)
  }
}