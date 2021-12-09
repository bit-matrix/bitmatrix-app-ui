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

export const usdtToLbtcSwapAmountCalculate = (
  usdtAmount: number,
  slippage?: number,
): number => {
  // validation
  if (usdtAmount < 50000000)
    console.log('Usdt amount must greaten or at least minimum equal 50000000');

  // step1 (fee calculation)
  const lpFee = div(usdtAmount, 400);

  // step2 (input new value without fee  input - step1)
  const usdtAmountWithoutFee = usdtAmount - lpFee;

  // step3 (total usd pool amount poolUsdtLiquidity + step2)
  const totalUsdtLiquidity = poolUsdtLiquidity + usdtAmountWithoutFee;

  // step4  (usdt Liquidty rate calculation step3 % 2mn)
  const usdtLiquidtyRate = div(totalUsdtLiquidity, 2000000);

  // step5 (Pool L-BTC liquidity % 16)
  const x = div(poolLbtcLiquidity, 16);

  // step6 (Pool USDT liquidity % 2MN)
  const y = div(poolUsdtLiquidity, 2000000);

  // step 7 (constant x*y = k step5*step6)
  const constant = x * y;

  // step 8 (constant * usdtLiquidtyRate  step7*step4
  const constantRate = div(constant, usdtLiquidtyRate);

  //step 9 (step 8 * 16)
  const lbtcAmount = constantRate * 16;

  //step 10 (poolLbtcLiquidity - step9)
  const remainingLbtcAmount = poolLbtcLiquidity - lbtcAmount;

  return remainingLbtcAmount;
};
