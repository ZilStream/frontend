import { Token } from 'store/types'
import BigNumber from 'bignumber.js'
import { OUTPUT_AFTER_FEE, ZIL_ADDRESS } from 'lib/constants'

export function getExchangeRate(tokenIn: Token, tokenOut: Token, amount: BigNumber, isIn: boolean) {
  const queryFunction = isIn ? getRatesForInput : getRatesForOutput
  return queryFunction(tokenIn, tokenOut, amount)
}

function getRatesForInput(tokenIn: Token, tokenOut: Token, tokenInAmount: BigNumber) {
  const { epsilonOutput, expectedOutput } = getOutputs(tokenIn, tokenOut, tokenInAmount)
  return {
    expectedAmount: expectedOutput,
    expectedSlippage: epsilonOutput.minus(expectedOutput).times(100).dividedBy(epsilonOutput).minus(0.3),
  }
}

function getRatesForOutput(tokenIn: Token, tokenOut: Token, tokenOutAmount: BigNumber) {
  const { epsilonInput, expectedInput } = getInputs(tokenIn, tokenOut, tokenOutAmount)
  return {
    expectedAmount: expectedInput,
    expectedSlippage: expectedInput.minus(epsilonInput).times(100).dividedBy(expectedInput).minus(0.3),
  }
}

function getInputs(tokenIn: Token, tokenOut: Token, tokenOutAmount: BigNumber
): { epsilonInput: BigNumber; expectedInput: BigNumber } {
  let expectedInput: BigNumber // the expected amount after slippage and fees
  let epsilonInput: BigNumber // the zero slippage input

  if (tokenIn.address_bech32 === ZIL_ADDRESS) {
    // zil to zrc2
    const { zil_reserve, token_reserve } = tokenOut.market_data
    epsilonInput = tokenOutAmount.times(zil_reserve).dividedToIntegerBy(token_reserve)
    expectedInput = getInputFor(tokenOutAmount, zil_reserve, token_reserve)
  } else if (tokenOut.address_bech32 === ZIL_ADDRESS) {
    // zrc2 to zil
    const { zil_reserve, token_reserve } = tokenIn.market_data
    epsilonInput = tokenOutAmount.times(token_reserve).dividedToIntegerBy(zil_reserve)
    expectedInput = getInputFor(tokenOutAmount, token_reserve, zil_reserve)
  } else {
    // zrc2 to zrc2
    const { zil_reserve: zr1, token_reserve: tr1 } = tokenOut.market_data
    const intermediateEpsilonInput = tokenOutAmount.times(zr1).dividedToIntegerBy(tr1)
    const intermediateInput = getInputFor(tokenOutAmount, zr1, tr1)

    const { zil_reserve: zr2, token_reserve: tr2 } = tokenIn.market_data
    epsilonInput = intermediateEpsilonInput.times(tr2).dividedToIntegerBy(zr2)
    expectedInput = getInputFor(intermediateInput, tr2, zr2)
  }

  return { epsilonInput, expectedInput }
}

function getOutputs(tokenIn: Token, tokenOut: Token, tokenInAmount: BigNumber): { epsilonOutput: BigNumber, expectedOutput: BigNumber } {
  let epsilonOutput: BigNumber // the zero slippage output
  let expectedOutput: BigNumber // the expected amount after slippage and fees

  if (tokenIn.address_bech32 === ZIL_ADDRESS) {
    // zil to zrc2
    const { zil_reserve, token_reserve } = tokenOut.market_data
    epsilonOutput = tokenInAmount.times(token_reserve).dividedToIntegerBy(zil_reserve)
    expectedOutput = getOutputFor(tokenInAmount, zil_reserve, token_reserve)
  } else if (tokenOut.address_bech32 === ZIL_ADDRESS) {
    // zrc2 to zil
    const { zil_reserve, token_reserve } = tokenIn.market_data
    epsilonOutput = tokenInAmount.times(zil_reserve).dividedToIntegerBy(token_reserve)
    expectedOutput = getOutputFor(tokenInAmount, token_reserve, zil_reserve)
  } else {
    // zrc2 to zrc2
    const { zil_reserve: zr1, token_reserve: tr1 } = tokenIn.market_data
    const intermediateEpsilonOutput = tokenInAmount.times(zr1).dividedToIntegerBy(tr1)
    const intermediateOutput = getOutputFor(tokenInAmount, tr1, zr1)

    const { zil_reserve: zr2, token_reserve: tr2 } = tokenOut.market_data
    epsilonOutput = intermediateEpsilonOutput.times(tr2).dividedToIntegerBy(zr2)
    expectedOutput = getOutputFor(intermediateOutput, zr2, tr2)
  }

  return { epsilonOutput, expectedOutput }
}

function getInputFor(outputAmount: BigNumber, inputReserve: number, outputReserve: number): BigNumber {
  const input = new BigNumber(inputReserve)
  const output = new BigNumber(outputReserve)
  if (input.isZero() || output.isZero()) {
    throw new Error('Reserve has 0 tokens.')
  }
  if (output.lte(outputAmount)) {
    return new BigNumber('NaN')
  }
  const numerator = input.times(outputAmount).times(10000)
  const denominator = output.minus(outputAmount).times(OUTPUT_AFTER_FEE)
  return numerator.dividedToIntegerBy(denominator).plus(1)
}

function getOutputFor(inputAmount: BigNumber, inputReserve: number, outputReserve: number): BigNumber {
  const input = new BigNumber(inputReserve)
  const output = new BigNumber(outputReserve)
  if (input.isZero() || output.isZero()) {
    throw new Error('Reserve has 0 tokens.')
  }
  const inputAfterFee = inputAmount.times(OUTPUT_AFTER_FEE)
  const numerator = inputAfterFee.times(output)
  const denominator = input.times(10000).plus(inputAfterFee)
  return numerator.dividedToIntegerBy(denominator)
}