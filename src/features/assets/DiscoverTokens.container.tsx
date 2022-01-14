import { LoadingButton } from '@mui/lab';
import { Grid } from '@mui/material';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectHistoryLoading, selectTransactions } from '../history/historySlice';
import { selectActiveAccount } from '../login/loginSlice';
import { discoverTokensAsync, selectAssetsLoading } from './assetsSlice';

export const DiscoverTokens = () => {
  const dispatch = useAppDispatch();
  const isHistoryLoading = useAppSelector(selectHistoryLoading);
  const isLoading = useAppSelector(selectAssetsLoading);
  const transactions = useAppSelector(selectTransactions);
  const selectedAccount = useAppSelector(selectActiveAccount);

  const handleClick = useCallback(() => {
    if (selectedAccount && transactions.length > 0) {
      dispatch(discoverTokensAsync({ account: selectedAccount, transactions }));
    }
  }, [dispatch, selectedAccount, transactions]);

  return (
    <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center">
      {!isHistoryLoading && (
        <LoadingButton variant="outlined" onClick={handleClick} loading={isLoading}>
          Discover tokens
        </LoadingButton>
      )}
    </Grid>
  );
};
