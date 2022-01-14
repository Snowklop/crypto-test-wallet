import { ethers } from "ethers";

export async function getHistory(account: string) {
  let provider = new ethers.providers.EtherscanProvider();
  const history = await provider.getHistory(account);
  return { data: history };
}