import { ethers } from 'ethers';

export const getProvider = () => new ethers.providers.Web3Provider(window.ethereum!);

export const DEFAULT_TOKEN_ABY =
  '["function name() view returns (string)", "function symbol() view returns (string)", "function balanceOf(address account) view returns (uint256)", "function decimals() view returns (uint8)", "function owner() view returns (address)",  "function migrator() view returns (address)"]';
