
// see https://docs.etherscan.io/api-endpoints/accounts#get-a-list-of-erc20-token-transfer-events-by-address
export interface TokenTransaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  contractAddress: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
}

export interface TokenAsset {
  name: string;
  symbol: string;
  decimals: number;
}

export interface TokenBalances {
  [address: string]: number;
}

export interface TokenAssets {
  [address: string]: TokenAsset;
}

export enum EtherscanStatus {
  SUCCESS = '1',
  FAILED = '0'
}

export enum EtherscanMessage {
  OK = 'OK',
  NOT_OK = 'NOTOK',
  EMPTY = 'No transactions found',
  WRONG_API_KEY = 'OK-Missing/Invalid API Key, rate limit of 1/5sec applied'
}