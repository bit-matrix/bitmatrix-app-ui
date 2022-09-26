import React, { useEffect, useState } from 'react';
import Svg from '../base/Svg/Svg';
import { amountRound, getAssetPrecession } from '../../helper';
import { Pool } from '@bitmatrix/models';
import { useParams } from 'react-router-dom';
import Numeral from 'numeral';
import { useChartsContext, usePoolContext, useSettingsContext } from '../../context';
import { arrowIconDirection } from '../utils/utils';
import { AssetIcon } from '../AssetIcon/AssetIcon';
import domtoimage from 'dom-to-image';
import { Helmet } from 'react-helmet';
import { ROUTE_PATH_TITLE } from '../../enum/ROUTE_PATH.TITLE';
import './PoolSummary.scss';

export const PoolSummary = (): JSX.Element => {
  const [pool, setPool] = useState<Pool>();
  const [previewLinkImage, setPreviewLinkImage] = useState<string>();
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  const { pools } = usePoolContext();
  const { settingsContext } = useSettingsContext();
  const { charts } = useChartsContext();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (pools && pools.length > 0) {
      const currentPool = pools.find((pl) => pl.id === id);
      setPool(currentPool);
    }
  }, [id, pools]);

  useEffect(() => {
    if (ref === null) {
      return;
    }

    domtoimage
      .toJpeg(ref)
      .then((dataUrl) => {
        setPreviewLinkImage(dataUrl);
        const link = document.createElement('a');
        link.download = 'pool-image.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ref]);

  if (pool === undefined || charts === undefined) {
    return <div className="no-pool-text">Pool couldn't found.</div>;
  } else {
    const data = charts?.find((cs) => cs.poolId === pool.id);

    return (
      <div className="pool-summary-main">
        <Helmet>
          <title>{ROUTE_PATH_TITLE.POOL}</title>
          <meta
            name="description"
            content="View pool metrics. Add liquidity to an existing pool or deploy your own liquidity pool."
          ></meta>
          <meta name="keywords" content="Bitmatrix, Liquid Bitcoin, Liquid Network, Create Pool, Add Liquidity"></meta>
          <meta name="robots" content="index, follow" />
          <link type="text/css" href="./Pool.scss" />
          <meta property="og:image" content-encoding={previewLinkImage} />
        </Helmet>
        <div ref={(newRef) => setRef(newRef)} className="pool-summary-container">
          <div className="pool-summary-pooled-asset">
            <div className="pool-summary-pooled-asset-black-container">
              <div className="pool-summary-pooled-asset-palegreen-container">
                <Svg
                  className="pool-summary-bitmatrix-icon"
                  path="M 78.1 73.55 L 219.4 121.9 360.7 73.55 219.4 25.55 78.1 73.55 M 144.2 159.95 L 63.35 132.55 63.35 292.3 213 342.7 213 135.75 144.2 159.95 M 137.15 181 Q 139.05 180.05 141.35 180.8 143.45 181.4 144.4 183.5 L 152.65 200.15 Q 153.4 201.5 154.55 201.5 L 172.9 204.2 Q 174.85 204.6 176 205.75 177.5 207.45 177.5 209.75 177.5 212.05 175.8 213.6 L 162.6 226.4 Q 161.8 227.2 161.8 228.7 L 165.1 246.95 Q 165.45 249.6 163.95 251.35 162.4 253.05 159.7 253.45 L 157.25 252.7 140.8 244.05 Q 139.45 243.5 138.5 244.05 L 122.05 252.7 Q 118.2 254.6 115.35 251.35 113.6 249.6 114.2 246.95 L 117.25 228.7 Q 117.45 227.4 116.5 226.4 L 103.3 213.6 Q 101.95 212.05 101.75 210.35 101.35 208.2 102.7 206.3 104.05 204.6 106.35 204.2 L 124.7 201.5 Q 125.85 201.5 126.45 200.15 L 134.65 183.5 Q 135.6 181.95 137.15 181 M 0 99.3 L 143.9 148.1 201.75 128.3 58.05 79.55 0 99.3 M 12.65 48.1 L 64.15 65.75 205.15 17.55 153.4 0 12.65 48.1 M 375.45 292.3 L 375.45 132.55 294.6 159.95 225.75 135.75 225.75 342.7 375.45 292.3 M 325.3 180.65 L 338.15 182.55 Q 339.5 182.8 340.3 183.6 341.35 184.8 341.35 186.4 341.35 188 340.15 189.1 L 330.95 198.05 Q 330.4 198.6 330.4 199.65 L 332.7 212.4 Q 332.95 214.25 331.9 215.5 330.8 216.7 328.9 216.95 L 327.2 216.45 315.7 210.4 Q 314.75 210 314.1 210.4 L 302.6 216.45 Q 299.9 217.75 297.9 215.5 296.65 214.25 297.1 212.4 L 299.25 199.65 Q 299.35 198.75 298.7 198.05 L 289.45 189.1 Q 288.55 188 288.4 186.85 288.1 185.35 289.05 184 290 182.8 291.6 182.55 L 304.45 180.65 Q 305.25 180.65 305.65 179.7 L 311.4 168.05 Q 312.05 167 313.15 166.3 314.45 165.65 316.1 166.2 317.55 166.6 318.2 168.05 L 324 179.7 Q 324.5 180.65 325.3 180.65 M 284.3 242.65 L 297.15 244.55 Q 298.5 244.8 299.3 245.6 300.35 246.8 300.35 248.4 300.35 250 299.15 251.1 L 289.95 260.05 Q 289.4 260.6 289.4 261.65 L 291.7 274.4 Q 291.95 276.25 290.9 277.5 289.8 278.7 287.9 278.95 L 286.2 278.45 274.7 272.4 Q 273.75 272 273.1 272.4 L 261.6 278.45 Q 258.9 279.75 256.9 277.5 255.65 276.25 256.1 274.4 L 258.25 261.65 Q 258.35 260.75 257.7 260.05 L 248.45 251.1 Q 247.55 250 247.4 248.85 247.1 247.35 248.05 246 249 244.8 250.6 244.55 L 263.45 242.65 Q 264.25 242.65 264.65 241.7 L 270.4 230.05 Q 271.05 229 272.15 228.3 273.45 227.65 275.1 228.2 276.55 228.6 277.2 230.05 L 283 241.7 Q 283.5 242.65 284.3 242.65 M 438.8 99.3 L 380.75 79.55 237.05 128.3 294.9 148.1 438.8 99.3 M 374.65 65.75 L 426.15 48.1 285.4 0 233.65 17.55 374.65 65.75 Z"
                  viewBox="0 0 441 345"
                ></Svg>

                <div className="pool-summary-box-container">
                  <AssetIcon className="pool-summary-box-icon" asset={pool.quote.assetHash} />
                  <span className="pool-summary-box-value">
                    {amountRound(
                      Number(pool.quote.value) /
                        Math.pow(10, getAssetPrecession(pool.quote, settingsContext.preferred_unit.text)),
                    )}
                  </span>
                </div>

                <div className="pool-summary-box-container">
                  <AssetIcon className="pool-summary-box-icon" asset={pool.token.assetHash} />
                  <span className="pool-summary-box-value">
                    {amountRound(
                      Number(pool.token.value) /
                        Math.pow(10, getAssetPrecession(pool.token, settingsContext.preferred_unit.text)),
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="pool-summary-black-container">
              <div className="pool-summary-palegreen-container"></div>
            </div>
          </div>

          <div className="pool-summary-pool-metrics-container">
            <div className="pool-summary-row">
              <div className="pool-summary-title">
                <div>
                  <span className="mobile-hidden">{pool.token.ticker}</span>
                  <span>&nbsp;Price</span>
                </div>
              </div>
              <div className="pool-summary-value">${data?.price.todayValue.toLocaleString()}</div>
              <div className="pool-summary-icon-content">
                {arrowIconDirection(data?.price.rate.direction)}
                <span className={`pool-summary-arrow-${data?.price.rate.direction}-text`}>
                  {data?.price.rate.value}%
                </span>
              </div>
            </div>

            <div className="pool-summary-row">
              <div className="pool-summary-title">
                <span>Volume</span>
                <span className="mobile-hidden">&nbsp;24h</span>
              </div>
              <div className="pool-summary-value">${Numeral(data?.volume.todayValue).format('(0.00a)')}</div>
              <div className="pool-summary-icon-content">
                {arrowIconDirection(data?.volume.rate.direction)}
                <span className={`pool-summary-arrow-${data?.volume.rate.direction}-text`}>
                  {data?.volume.rate.value}%
                </span>
              </div>
            </div>

            <div className="pool-summary-row">
              <div className="pool-summary-title">TVL</div>
              <div className="pool-summary-value">${Numeral(data?.tvl.todayValue).format('(0.00a)')}</div>
              <div className="pool-summary-icon-content">
                {arrowIconDirection(data?.tvl.rate.direction)}
                <span className={`pool-summary-arrow-${data?.tvl.rate.direction}-text`}>{data?.tvl.rate.value}%</span>
              </div>
            </div>

            <div className="pool-summary-row">
              <div className="pool-summary-title">
                <span>Fees</span>
                <span className="mobile-hidden">&nbsp;24h</span>
              </div>
              <div className="pool-summary-value">${Numeral(data?.fees.todayValue).format('(0.00a)')}</div>
              <div className="pool-summary-icon-content">
                {arrowIconDirection(data?.fees.rate.direction)}
                <span className={`pool-summary-arrow-${data?.fees.rate.direction}-text`}>{data?.fees.rate.value}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
