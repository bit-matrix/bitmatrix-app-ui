export enum ROUTE_PATH {
  HOME = '/',
  SWAP = '/swap',
  POOL = '/pool',
  POOL_DETAIL = '/pool/:id',
  MY_POOL = '/pool/my-pool/:id',
  SETTINGS = '/settings',
  ADD_LIQUIDTY = '/pool/:id/add-liquidity',
  REMOVE_LIQUIDITY = '/pool/:id/remove-liquidity',
  FACTORY = '/factory',
  ISSUE_TOKEN = '/factory/issue-token',
  NOT_FOUND = '*',
}
