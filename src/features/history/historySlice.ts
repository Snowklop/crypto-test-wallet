import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ethers } from "ethers";
import { RootState } from '../../app/store';
import { getHistory } from './historyAPI';

export interface HistoryState {
  transactions: ethers.providers.TransactionResponse[];
  areTransactionsLoading: boolean;
}

const initialState: HistoryState = {
  transactions: [],
  areTransactionsLoading: true,
};

export const getHistoryAsync = createAsyncThunk(
  'history/get',
  async (selectedAccount: string) => {
    const response = await getHistory(selectedAccount);
    return response.data;
  }
);

export const assetsSlice = createSlice({
  name: 'history',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getHistoryAsync.pending, (state) => {
        state.areTransactionsLoading = true;
      })
      .addCase(getHistoryAsync.fulfilled, (state, action) => {
        state.transactions = action.payload.reverse();
        state.areTransactionsLoading = false;
      })
  },
});

export const selectTransactions = (state: RootState) => state.history.transactions;
export const selectHistoryLoading = (state: RootState) => state.history.areTransactionsLoading;

export default assetsSlice.reducer;
