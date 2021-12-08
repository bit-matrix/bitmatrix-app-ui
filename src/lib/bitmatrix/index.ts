const poolLbtcLiquidity = 1000000;
const poolUsdtLiquidity = 50000000000;
const lpFeeRate = 400;

const div = (input1: number, input2: number) => Math.floor(input1 / input2);

// all amounts satoshi
export const lbtcToUsdtSwapAmountCalculate = (
  lbtcAmount: number,
  slippage?: number,
): number => {
  // step1   (lp fee calculate)
  const lpFee = div(lbtcAmount, lpFeeRate);
  console.log(lpFee);

  // step 2 (sub fee amount)
  const lbtcAmountSubFee = lbtcAmount - lpFee;

  // step 3 (poolLbtcLiquidity  + lbtcAmountSubFee)
  const lbtcPoolTotalAmount = poolLbtcLiquidity + lbtcAmountSubFee;

  // step 4 (lbtPoolTotalAmount with rate 16)
  const lbtcPoolTotalAmountWithRate = div(lbtcPoolTotalAmount, 16);

  // step 5 (lbtPoolAmount  with rate 16)
  const lbtcPoolAmountWithRate = div(poolLbtcLiquidity, 16);

  // step 6 (usdtPoolAmount  with rate 2 million)
  const usdtPoolAmountWithRate = div(poolUsdtLiquidity, 2000000);

  // step 7 (mul step 5 , step6)
  const poolRateMul = lbtcPoolAmountWithRate * usdtPoolAmountWithRate;

  // step 8 (div step7  step4)
  const poolRateMulWithLbtcPoolRate = div(
    poolRateMul,
    lbtcPoolTotalAmountWithRate,
  );

  // step 9  (step8 * 2 million)
  const poolRateMulWithLbtcPoolRateMul = poolRateMulWithLbtcPoolRate * 2000000;

  // step 10  (Pool Tether liquidity - 9.step)
  const finalTetherPoolLiquidity =
    poolUsdtLiquidity - poolRateMulWithLbtcPoolRateMul;

  //step11 ( step 10 - 1milion)
  const usdtAmount = finalTetherPoolLiquidity - 1000000;

  return usdtAmount;
};
