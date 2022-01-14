import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { ChangeEvent, useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addAsset } from './assetsSlice';
import { LoadingButton } from '@mui/lab';
import { getTokenInfo } from './assetsAPI';
import { selectActiveAccount } from '../login/loginSlice';

export const AddAssetDialog = () => {
  const [open, setOpen] = useState(false);
  const [tokenAddress, setTokenAddress] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const selectedAccount = useAppSelector(selectActiveAccount);
  const dispatch = useAppDispatch();
  const handleTextChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setTokenAddress(e.target.value);
    },
    [setTokenAddress],
  );
  const handleOpenDialog = useCallback(() => {
    setOpen(true);
  }, [setOpen]);
  const handleCloseDialog = useCallback(() => {
    setOpen(false);
    setTokenAddress('');
  }, [setOpen]);
  const handleConfirm = useCallback(() => {
    setError(undefined);
    setLoading(true);
    getTokenInfo(tokenAddress, selectedAccount!)
      .then((res) => {
        console.log('Result: ', res);
        dispatch(addAsset({ address: tokenAddress, account: selectedAccount!, ...res.data }));
        handleCloseDialog();
      })
      .catch((e) => {
        console.error(e);
        setError('Error adding token, please check if address is valid');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch, handleCloseDialog, setLoading, setError, tokenAddress, selectedAccount]);
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flex: '1 0 auto',
          justifyContent: 'center',
        }}
      >
        <IconButton aria-label="add" onClick={handleOpenDialog} color="primary">
          <AddIcon />
        </IconButton>
      </Box>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Add new token</DialogTitle>
        <DialogContent>
          {error && <DialogContentText color="error">{error}</DialogContentText>}

          <DialogContentText>Token will be added to existing tokens</DialogContentText>
          <TextField
            value={tokenAddress}
            onChange={handleTextChange}
            autoFocus
            margin="dense"
            id="name"
            label="Token Address"
            type="address"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <LoadingButton disabled={!tokenAddress} loading={isLoading} onClick={handleConfirm}>
            Add
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};
