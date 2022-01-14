import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getProvider } from '../../helpers/crypto.helper';

// A mock function to mimic making an async request for data
export function fetchCount(amount = 1) {
  return new Promise<{ data: number }>((resolve) => setTimeout(() => resolve({ data: amount }), 500));
}

export async function checkWallet() {
  const accounts = await getProvider().listAccounts();
  return { data: accounts };
}

export async function connectWallet() {
  try {
    const result = await getProvider().send('eth_requestAccounts', []);
    return { data: result };
  } catch (e) {
    return { data: [] };
  }
}

const loginApi = createApi({
  reducerPath: 'loginApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'SOME_URL' }),
  endpoints: (builder) => ({
    connect: builder.query<void, number>({
      query: (walletId) => `URL_HERE/${walletId}`,
    }),
  }),
});

export const { useConnectQuery } = loginApi;
