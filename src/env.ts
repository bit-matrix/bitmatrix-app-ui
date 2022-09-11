import { AssetModel } from './helper';
const base_host = process.env.UI_BASE_HOST || 'localhost';

const api_port = process.env.UI_API_PORT || '8000';
const api_host = process.env.UI_API_HOST || base_host;
const api_url = process.env.UI_API_URL || `http://${api_host}:${api_port}`;

const db_port = process.env.UI_DB_PORT || '8001';
const db_host = process.env.UI_DB_HOST || base_host;
const db_url = process.env.UI_DB_URL || `http://${db_host}:${db_port}`;

export const API_SOCKET_SERVER_URL = api_url + '/';
export const DB_SOCKET_SERVER_URL = db_url + '/';

export const BITMATRIX_RPC_URL = 'https://rpc.basebitmatrix.com/';

export const LBTC_ASSET_HASH = '6f0279e9ed041c3d710a9f57d0c02928416460c4b722ae3457a11eec381c526d';

export const BANANA_THEME_ASSET = '657447fa93684f04c4bad40c5adfb9aec1531e328371b1c7f2d45f8591dd7b56';

export const LBTC_ASSET: AssetModel = {
  assetHash: LBTC_ASSET_HASH,
  name: 'Liquid Bitcoin',
  ticker: 'tL-BTC',
  precision: 8,
};

export const IS_TESTNET = false;

export const FUNDING_ADDRESS = 'ex1qft5p2uhsdcdc3l2ua4ap5qqfg4pjaqlp250x7us7a8qqhrxrxfsqk82yg8';

export const PAIR1_ASSET_LIST = [
  '6f0279e9ed041c3d710a9f57d0c02928416460c4b722ae3457a11eec381c526d',
  'ce091c998b83c78bb71a632313ba3760f1763d9cfcffae02258ffa9865a37bd2',
  '0e99c1a6da379d1f4151fb9df90449d40d0608f6cb33a5bcbfc8c265f42bab0a',
];
