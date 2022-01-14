import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ethers } from 'ethers';
import { RootState } from '../../app/store';
import { ASSETS_STORAGE_KEY } from '../../constans';
import { TokenAsset, TokenAssets, TokenBalances } from '../../types';
import { discoverERC20Tokens, loadBalances } from './assetsAPI';

function saveAssets(account: string, assets: TokenAssets) {
  const storageAssets = localStorage.getItem(ASSETS_STORAGE_KEY) || '{}';
  const parsedAssets = JSON.parse(storageAssets);
  parsedAssets[account] = assets;
  localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(parsedAssets));
}

export interface AssetsState {
  assets: TokenAssets;
  assetsBalance?: TokenBalances;
  areAssetsDiscovering: boolean;
  areBalancesLoading: boolean;
  isTokenAdding: boolean;
  addTokenError?: string;
}

const initialState: AssetsState = {
  assets: {},
  areAssetsDiscovering: false,
  areBalancesLoading: true,
  isTokenAdding: false,
};

interface DiscoverTokensRequest {
  account: string;
  transactions: ethers.providers.TransactionResponse[];
}

export const discoverTokensAsync = createAsyncThunk('assets/discover', async (request: DiscoverTokensRequest) => {
  const response = await discoverERC20Tokens(request.account, request.transactions);
  return { account: request.account, assets: response.tokens, balances: response.balances };
});

export const loadBalancesAsync = createAsyncThunk('assets/balance/load', async (account: string, { getState }) => {
  const response = await loadBalances(account, (getState() as RootState).assets.assets);
  return response.data;
});

export const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    loadAssets(state, action: PayloadAction<string>) {
      const storageAssets = localStorage.getItem(ASSETS_STORAGE_KEY) || '{}';
      const parsedAssets = JSON.parse(storageAssets);
      if (!parsedAssets[action.payload]) {
        parsedAssets[action.payload] = {};
        saveAssets(action.payload, {});
      }
      state.assets = parsedAssets[action.payload];
    },
    addAsset(state, action: PayloadAction<{ balance: number; asset: TokenAsset; address: string; account: string }>) {
      state.assets = {
        ...state.assets,
        [action.payload.address]: action.payload.asset,
      };
      saveAssets(action.payload.account, state.assets);
      state.assetsBalance = {
        ...state.assetsBalance,
        [action.payload.address]: action.payload.balance,
      };
    },
    removeAsset(state, action: PayloadAction<string>) {
      delete state.assets[action.payload];
      saveAssets(action.payload, state.assets);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(discoverTokensAsync.pending, (state) => {
        state.areAssetsDiscovering = true;
      })
      .addCase(discoverTokensAsync.fulfilled, (state, action) => {
        state.assets = {
          ...state.assets,
          ...action.payload.assets,
        };
        saveAssets(action.payload.account, state.assets);
        state.assetsBalance = {
          ...state.assetsBalance,
          ...action.payload.balances,
        };
        state.areBalancesLoading = false;
        state.areAssetsDiscovering = false;
      })
      .addCase(loadBalancesAsync.pending, (state) => {
        state.areBalancesLoading = true;
      })
      .addCase(loadBalancesAsync.fulfilled, (state, action) => {
        state.assetsBalance = action.payload;
        state.areBalancesLoading = false;
      });
  },
});

export const { loadAssets, removeAsset, addAsset } = assetsSlice.actions;

export const selectAssets = (state: RootState) => state.assets.assets;
export const selectAssetsBalance = (state: RootState) => state.assets.assetsBalance;
export const selectAssetsBalanceLoading = (state: RootState) => state.assets.areBalancesLoading;
export const selectAssetsLoading = (state: RootState) => state.assets.areAssetsDiscovering;
export const selectAddTokenError = (state: RootState) => state.assets.addTokenError;
export const selectIsTokenAdding = (state: RootState) => state.assets.isTokenAdding;

export default assetsSlice.reducer;
