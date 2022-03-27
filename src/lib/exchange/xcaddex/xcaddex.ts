import { Token } from 'store/types'
import BigNumber from 'bignumber.js'
import { ZILSWAP_ADDRESS, ZIL_ADDRESS } from 'lib/constants'
import { Exchange } from '../exchange'
import { ExchangeRate } from '../types'
import { Contract, Value, CallParams } from '@zilliqa-js/contract';
import { fromBech32Address } from '@zilliqa-js/crypto'
import { Zilliqa } from '@zilliqa-js/zilliqa'
import { Transaction } from '@zilliqa-js/account'
import { BN } from '@zilliqa-js/util'
import { DEX } from 'types/dex.interface'
import { BIG_ZERO } from 'utils/strings'

export class XCADDex extends Exchange {
  readonly contractAddress: string;
  readonly contractHash: string;
  readonly contract: Contract;

  private static OUTPUT_AFTER_FEE = "9970"

  constructor(zilliqa: Zilliqa, provider: any) {
    super(zilliqa, provider)

    this.contractAddress = ZILSWAP_ADDRESS
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
    const minimumOutput = expectedOutput.minus(expectedOutput.times(slippage)).decimalPlaces(0)

    let txn: { transition: string; args: Value[]; params: CallParams }

    if(tokenIn.address === ZIL_ADDRESS) {
      // zil to zrc2
      txn = {
        transition: 'SwapExactZILForTokens',
        args: [
          {
            vname: 'token_address',
            type: 'ByStr20',
            value: fromBech32Address(tokenOut.address),
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
    } else if(tokenOut.address === ZIL_ADDRESS) {
      // zrc2 to zil
      txn = {
        transition: 'SwapExactTokensForZIL',
        args: [
          {
            vname: 'token_address',
            type: 'ByStr20',
            value: fromBech32Address(tokenIn.address),
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
        transition: 'DirectSwapExactTokens0ToTokens1',
        args: [
          {
            vname: 'token0_address',
            type: 'ByStr20',
            value: fromBech32Address(tokenIn.address),
          },
          {
            vname: 'token1_address',
            type: 'ByStr20',
            value: fromBech32Address(tokenOut.address),
          },
          {
            vname: 'token0_amount',
            type: 'Uint128',
            value: amount.toString(),
          },
          {
            vname: 'token1_amount',
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

    if(tokenIn.address === ZIL_ADDRESS) {
      // zil to zrc2
      txn = {
        transition: 'SwapZILForExactTokens',
        args: [
          {
            vname: 'token_address',
            type: 'ByStr20',
            value: fromBech32Address(tokenOut.address),
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
    } else if(tokenOut.address === ZIL_ADDRESS) {
      // zrc2 to zil
      txn = {
        transition: 'SwapTokensForExactZIL',
        args: [
          {
            vname: 'token_address',
            type: 'ByStr20',
            value: fromBech32Address(tokenIn.address),
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
        transition: 'DirectSwapTokens0ToExactTokens1',
        args: [
          {
            vname: 'token0_address',
            type: 'ByStr20',
            value: fromBech32Address(tokenIn.address),
          },
          {
            vname: 'token1_address',
            type: 'ByStr20',
            value: fromBech32Address(tokenOut.address),
          },
          {
            vname: 'token0_amount',
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
  
    if (tokenIn.address === ZIL_ADDRESS) {
      // zil to zrc2
      const { baseReserve, quoteReserve } = this.getReserves(tokenIn, tokenOut)
      epsilonInput = tokenOutAmount.times(quoteReserve).dividedToIntegerBy(baseReserve)
      expectedInput = this.getInputFor(tokenOutAmount, quoteReserve, baseReserve)
    } else if (tokenOut.address === ZIL_ADDRESS) {
      // zrc2 to zil
      const { baseReserve, quoteReserve } = this.getReserves(tokenIn, tokenOut)
      epsilonInput = tokenOutAmount.times(baseReserve).dividedToIntegerBy(quoteReserve)
      expectedInput = this.getInputFor(tokenOutAmount, baseReserve, quoteReserve)
    } else {
      // zrc2 to zrc2
      const { quoteReserve: zr1, baseReserve: tr1 } = this.getReserves(tokenIn, tokenOut)
      const intermediateEpsilonInput = tokenOutAmount.times(zr1).dividedToIntegerBy(tr1)
      const intermediateInput = this.getInputFor(tokenOutAmount, zr1, tr1)
  
      const { quoteReserve: zr2, baseReserve: tr2 } = this.getReserves(tokenIn, tokenOut)
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
  
    if (tokenIn.address === ZIL_ADDRESS) {
      // zil to zrc2
      const { baseReserve, quoteReserve } = this.getReserves(tokenIn, tokenOut)
      epsilonOutput = tokenInAmount.times(baseReserve).dividedToIntegerBy(quoteReserve)
      expectedOutput = this.getOutputFor(tokenInAmount, quoteReserve, baseReserve)
    } else if (tokenOut.address === ZIL_ADDRESS) {
      // zrc2 to zil
      const { baseReserve, quoteReserve } = this.getReserves(tokenIn, tokenOut)
      epsilonOutput = tokenInAmount.times(quoteReserve).dividedToIntegerBy(baseReserve)
      expectedOutput = this.getOutputFor(tokenInAmount, baseReserve, quoteReserve)
    } else {
      // zrc2 to zrc2
      if(tokenIn.address === 'zil1z5l74hwy3pc3pr3gdh3nqju4jlyp0dzkhq2f5y') {
        const { baseReserve, quoteReserve } = this.getReserves(tokenIn, tokenOut)
        epsilonOutput = tokenInAmount.times(baseReserve).dividedToIntegerBy(quoteReserve)
        expectedOutput = this.getOutputFor(tokenInAmount, quoteReserve, baseReserve)
      } else {
        const { baseReserve, quoteReserve } = this.getReserves(tokenIn, tokenOut)
      epsilonOutput = tokenInAmount.times(quoteReserve).dividedToIntegerBy(baseReserve)
      expectedOutput = this.getOutputFor(tokenInAmount, baseReserve, quoteReserve)
      }     
    }
  
    return { epsilonOutput, expectedOutput }
  }

  private getInputFor(
    outputAmount: BigNumber, 
    inputReserve: BigNumber, 
    outputReserve: BigNumber
  ): BigNumber {
    if (inputReserve.isZero() || outputReserve.isZero()) {
      throw new Error('Reserve has 0 tokens.')
    }
    if (outputReserve.lte(outputAmount)) {
      return new BigNumber('NaN')
    }
    const numerator = inputReserve.times(outputAmount).times(10000)
    const denominator = outputReserve.minus(outputAmount).times(XCADDex.OUTPUT_AFTER_FEE)
    return numerator.dividedToIntegerBy(denominator).plus(1)
  }

  private getOutputFor(
    inputAmount: BigNumber, 
    inputReserve: BigNumber, 
    outputReserve: BigNumber
  ): BigNumber {
    if (inputReserve.isZero() || outputReserve.isZero()) {
      throw new Error('Reserve has 0 tokens.')
    }
    const inputAfterFee = inputAmount.times(XCADDex.OUTPUT_AFTER_FEE)
    const numerator = inputAfterFee.times(outputReserve)
    const denominator = inputReserve.times(10000).plus(inputAfterFee)
    return numerator.dividedToIntegerBy(denominator)
  }

  private getReserves(tokenIn: Token, tokenOut: Token) {
    const baseInPools = tokenIn.pools?.filter(pool => pool.baseAddress === tokenIn.address && pool.quoteAddress === tokenOut.address && pool.dex === DEX.XCADDEX) ?? []
    const quoteInPools = tokenIn.pools?.filter(pool => pool.baseAddress === tokenOut.address && pool.quoteAddress === tokenIn.address && pool.dex === DEX.XCADDEX) ?? []
    const baseOutPools = tokenOut.pools?.filter(pool => pool.baseAddress === tokenIn.address && pool.quoteAddress === tokenOut.address && pool.dex === DEX.XCADDEX) ?? []
    const quoteOutPools = tokenOut.pools?.filter(pool => pool.baseAddress === tokenOut.address && pool.quoteAddress === tokenIn.address && pool.dex === DEX.XCADDEX) ?? []
    const pool = baseInPools.concat(quoteInPools, baseOutPools, quoteOutPools)?.[0]

    if(!pool) {
      return {
        baseReserve: new BigNumber(0),
        quoteReserve: new BigNumber(0)
      }
    }
    var { baseReserve, quoteReserve } = pool
    baseReserve = baseReserve ?? BIG_ZERO
    quoteReserve = quoteReserve ?? BIG_ZERO
    return { baseReserve, quoteReserve }
  }
}