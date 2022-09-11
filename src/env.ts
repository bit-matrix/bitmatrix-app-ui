import { AssetModel } from './helper';
import { TESTNET_ASSET_ID } from './lib/liquid-dev/ASSET_ID';

const base_host = process.env.UI_BASE_HOST || 'localhost';

const api_port = process.env.UI_API_PORT || '8000';
const api_host = process.env.UI_API_HOST || base_host;
const api_url = process.env.UI_API_URL || `http://${api_host}:${api_port}`;

const db_port = process.env.UI_DB_PORT || '8001';
const db_host = process.env.UI_DB_HOST || base_host;
const db_url = process.env.UI_DB_URL || `http://${db_host}:${db_port}`;

export const API_SOCKET_SERVER_URL = api_url + '/';
export const DB_SOCKET_SERVER_URL = db_url + '/';

export const PAIR_1_LIST = [TESTNET_ASSET_ID.LBTC, TESTNET_ASSET_ID.USDT];

export const LBTC_ASSET_HASH = '144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49';

export const USDT_ASSET = 'f3d1ec678811398cd2ae277cbe3849c6f6dbd72c74bc542f7c4b11ff0e820958';

export const BANANA_THEME_ASSET = '657447fa93684f04c4bad40c5adfb9aec1531e328371b1c7f2d45f8591dd7b56';

export const LBTC_ASSET: AssetModel = {
  assetHash: LBTC_ASSET_HASH,
  name: 'Liquid Bitcoin',
  ticker: 'tL-BTC',
  precision: 8,
};
