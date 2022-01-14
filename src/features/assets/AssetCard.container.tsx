import { Delete as DeleteIcon } from '@mui/icons-material';
import { Box, Card, CircularProgress, CardContent, CardMedia, IconButton, Typography } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { removeAsset, selectAssetsBalance, selectAssetsBalanceLoading } from './assetsSlice';
import defaultERC20Logo from './erc20.png';

type Props = {
  name: string;
  symbol: string;
  address: string;
  imageUrl?: string;
};

export const AssetCard = ({ address, name, symbol, imageUrl = defaultERC20Logo }: Props) => {
  const dispatch = useAppDispatch();
  const assetsBalance = useAppSelector(selectAssetsBalance);
  const assetsBalanceLoading = useAppSelector(selectAssetsBalanceLoading);
  const assetAmount = useMemo(() => (assetsBalance ? assetsBalance[address] : undefined), [address, assetsBalance]);
  const handleDelete = useCallback(() => {
    dispatch(removeAsset(address));
  }, [dispatch, address]);
  return (
    <Card sx={{ display: 'flex', m: 2 }}>
      <CardMedia component="img" sx={{ width: 80 }} image={imageUrl} alt={`${name} logo`} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flex: '1 0 auto',
          alignItems: 'space-between',
        }}
      >
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography>
            {symbol} ({name})
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            Amount: {assetsBalanceLoading ? <CircularProgress size={12} /> : assetAmount}
          </Typography>
        </CardContent>
        <IconButton aria-label="delete" onClick={handleDelete} color="error" sx={{ margin: 3 }}>
          <DeleteIcon />
        </IconButton>
      </Box>
    </Card>
  );
};
