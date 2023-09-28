import BigNumber from "bignumber.js";

export const BIG_ZERO = new BigNumber(0);
export const BIG_ONE = new BigNumber(1);

export const parseBN = (
  input?: string | BigNumber | number,
  defaultValue?: BigNumber
) => {
  if (!input && input !== 0) return defaultValue;
  const result = BigNumber.isBigNumber(input) ? input : new BigNumber(input);
  if (!result.isFinite() || result.isNaN()) return defaultValue;

  return result;
};

export const bnOrZero = (
  input?: string | BigNumber | number,
  defaultValue: BigNumber = BIG_ZERO
) => {
  return parseBN(input, defaultValue)!;
};

const BILLION = BIG_ONE.shiftedBy(9);
const MILLION = BIG_ONE.shiftedBy(6);
const THOUSAND = BIG_ONE.shiftedBy(3);

export const toHumanNumber = (
  input?: string | BigNumber | number,
  dp: number = 5
) => {
  const value = bnOrZero(input);

  if (value.lt(THOUSAND)) return value.decimalPlaces(dp).toFormat();

  if (value.lt(MILLION))
    return `${value.shiftedBy(-3).decimalPlaces(dp).toFormat()}K`;

  if (value.lt(BILLION))
    return `${value.shiftedBy(-6).decimalPlaces(dp).toFormat()}M`;

  return `${value.shiftedBy(-9).decimalPlaces(dp).toFormat()}B`;
};
