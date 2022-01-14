import { ethers } from "ethers";
import { DEFAULT_TOKEN_ABY, getProvider } from "../../helpers/crypto.helper";
import {
  EtherscanMessage,
  TokenAssets,
  TokenBalances,
  TokenTransaction,
} from "../../types";

export async function discoverERC20Tokens(
  account: string,
  transactions: ethers.providers.TransactionResponse[]
) {
  try {
    const tokens: TokenAssets = {};
    const balances: TokenBalances = {};

    for (const transaction of transactions) {
      if (transaction.to && !tokens[transaction.to]) {
        const code = await getProvider().getCode(transaction.to);
        if (code.length > 2) {
          try {
            const contract = new ethers.Contract(
              transaction.to,
              DEFAULT_TOKEN_ABY,
              getProvider()
            );
            const decimals = await contract.decimals();
            tokens[transaction.to] = {
              name: await contract.name(),
              symbol: await contract.symbol(),
              decimals,
            };
            balances[transaction.to] = parseFloat(
              `${await contract.balanceOf(account)}e-${decimals}`
            );
          } catch (e) {
            // Not default aby is not appliable to this address
          }
        }
      }
    }
    return { tokens, balances };
  } catch (e) {
    console.error("Unexpected error: ", e);
    throw e;
  }
}

export async function loadBalances(account: string, assets: TokenAssets) {
  const balances: TokenBalances = {};
  for (const assetAccount in assets) {
    try {
      const contract = new ethers.Contract(
        assetAccount,
        DEFAULT_TOKEN_ABY,
        getProvider()
      );
      balances[assetAccount] = parseFloat(
        `${await contract.balanceOf(account)}e-${assets[assetAccount].decimals}`
      );
    } catch (e) {
      // Not default aby is not appliable to this address
    }
  }
  return { data: balances };
}

export async function getTokenInfo(address: string, account: string) {
  const contract = new ethers.Contract(
    address,
    DEFAULT_TOKEN_ABY,
    getProvider()
  );
  const decimals = await contract.decimals();
  const asset = {
    name: await contract.name(),
    symbol: await contract.symbol(),
    decimals,
  };
  const tokenBalance = parseFloat(
    `${await contract.balanceOf(account)}e-${asset.decimals}`
  );
  return {
    data: {
      balance: tokenBalance,
      asset,
    },
  };
}

export async function getERC20TokenTransfers(
  account: string,
  page: number,
  offset = 100,
  retryCount = 0
): Promise<TokenTransaction[]> {
  try {
    const urlParams = new URLSearchParams();
    urlParams.append("module", "account");
    urlParams.append("action", "tokentx");
    urlParams.append("address", account);

    urlParams.append("apikey", process.env.REACT_APP_ETHERSCAN_TOKEN!);
    urlParams.append("page", page.toString());
    urlParams.append("offset", offset.toString());
    const query = urlParams.toString();
    const response = await (
      await fetch(
        `${process.env.REACT_APP_ETHERSCAN_API}/${query ? `?${query}` : ""}`
      )
    ).json();
    if (response.message === EtherscanMessage.NOT_OK) {
      const maxRetryCount = parseInt(
        process.env.REACT_APP_ETHERSCAN_MAX_RETRY_COUNT!
      );
      if (retryCount >= maxRetryCount)
        throw Error("Retry count limit exceeded");
      return new Promise((resolve) =>
        setTimeout(
          resolve,
          parseInt(process.env.REACT_APP_ETHERSCAN_RETRY_TIMEOUT!)
        )
      ).then(() =>
        getERC20TokenTransfers(account, page, offset, retryCount + 1)
      );
    }
    return response.result;
  } catch (e) {
    console.error("Unexpected error: ", e);
    throw e;
  }
}

export async function getContractAby(
  address: string,
  retryCount = 0
): Promise<string> {
  try {
    const urlParams = new URLSearchParams();
    urlParams.append("module", "contract");
    urlParams.append("action", "getabi");
    urlParams.append("address", address);

    urlParams.append("apikey", process.env.REACT_APP_ETHERSCAN_TOKEN!);
    const query = urlParams.toString();
    const response = await (
      await fetch(
        `${process.env.REACT_APP_ETHERSCAN_API}/${query ? `?${query}` : ""}`
      )
    ).json();
    if (response.message === EtherscanMessage.NOT_OK) {
      const maxRetryCount = parseInt(
        process.env.REACT_APP_ETHERSCAN_MAX_RETRY_COUNT!
      );
      if (retryCount >= maxRetryCount)
        throw Error("Retry count limit exceeded");
      return new Promise((resolve) =>
        setTimeout(
          resolve,
          parseInt(process.env.REACT_APP_ETHERSCAN_RETRY_TIMEOUT!)
        )
      ).then(() => getContractAby(address, retryCount + 1));
    }
    return response.result;
  } catch (e) {
    console.error("Unexpected error: ", e);
    throw e;
  }
}
