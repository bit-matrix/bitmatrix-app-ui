/* eslint-disable @typescript-eslint/no-unused-vars */
const poolLbtcLiquidity = 1000000;
const poolUsdtLiquidity = 50000000000;
const lpFeeRate = 500;

const fees = {
  baseFee: 1200,
  orderingFee: 1,
  serviceFee: 650,
  commitmentTxFee: 100,
};

const div = (input1: number, input2: number) => Math.floor(input1 / input2);

export type FundingOutput = {
  fundingOutput1Value: number;
  fundingOutput2Value: number;
  fundingOutput1Address: string;
  fundingOutput2Address: string;
  fundingOutput1AssetId: string;
  fundingOutput2AssetId: string;
};

// all amounts satoshi
export const lbtcToUsdtSwapAmountCalculate = (
  lbtcAmount: number,
  slippage?: number,
): number => {
  // step1   (lp fee calculate)
  const lpFee = div(lbtcAmount, lpFeeRate);

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

  const slippageAmount = div(usdtAmount, 200);

  console.log(usdtAmount);
  console.log(slippageAmount);
  return usdtAmount - slippageAmount;
};

export const usdtToLbtcSwapAmountCalculate = (
  usdtAmount: number,
  slippage?: number,
): number => {
  // validation
  if (usdtAmount < 50000000)
    console.log('Usdt amount must greaten or at least minimum equal 50000000');

  // step1 (fee calculation)
  const lpFee = div(usdtAmount, lpFeeRate);

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

// step1
export const lbtcToUsdtSwap = (lbtcAmount: number): FundingOutput => {
  const fundingOutput1Value = lbtcAmount;
  const fundingOutput2Value =
    fees.baseFee + fees.commitmentTxFee + fees.orderingFee + fees.serviceFee;

  const fundingOutput1Address =
    'tex1qft5p2uhsdcdc3l2ua4ap5qqfg4pjaqlp250x7us7a8qqhrxrxfsqh7creg';
  const fundingOutput2Address =
    'tex1qft5p2uhsdcdc3l2ua4ap5qqfg4pjaqlp250x7us7a8qqhrxrxfsqh7creg';

  const fundingOutput1AssetId =
    '144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49';

  const fundingOutput2AssetId =
    '144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49';

  return {
    fundingOutput1Value,
    fundingOutput2Value,
    fundingOutput1Address,
    fundingOutput2Address,
    fundingOutput1AssetId,
    fundingOutput2AssetId,
  };
};
