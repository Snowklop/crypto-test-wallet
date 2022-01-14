import { LoadingButton } from '@mui/lab';
import { CircularProgress, Grid } from '@mui/material';
import { ethers } from 'ethers';
import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  checkWalletAsync,
  selectHasExtension,
  selectIsConnecting,
  selectIsLoading,
  connectWalletAsync,
} from './loginSlice';

declare global {
  interface Window {
    ethereum?: ethers.providers.ExternalProvider;
  }
}

export const Login = () => {
  const hasExtension = useAppSelector(selectHasExtension);
  const isLoading = useAppSelector(selectIsLoading);
  const isConnecting = useAppSelector(selectIsConnecting);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (hasExtension) dispatch(checkWalletAsync());
  }, [dispatch, hasExtension]);

  const handleConnectWallet = useCallback(() => {
    dispatch(connectWalletAsync());
  }, [dispatch]);

  let content = (
    <LoadingButton loading={isConnecting} onClick={handleConnectWallet} variant="outlined">
      Connect wallet
    </LoadingButton>
  );

  if (!hasExtension) {
    content = <p>Seems like you do not have wallet extension installed</p>;
  }
  if (isLoading) {
    content = <CircularProgress />;
  }

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh' }}
    >
      {content}
    </Grid>
  );
};
