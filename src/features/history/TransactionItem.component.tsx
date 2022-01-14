import { ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { TrendingDown as TrendingDownIcon, TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import { ethers } from 'ethers';
import { useMemo } from 'react';

type Props = {
  transaction: ethers.providers.TransactionResponse;
  isReceiver: boolean;
};

export const TransactionItem = ({ transaction, isReceiver }: Props) => {
  const address = useMemo(
    () => (isReceiver ? `From: ${transaction.from}` : `To: ${transaction.to}`),
    [transaction.from, transaction.to, isReceiver],
  );
  const amount = useMemo(() => ethers.utils.formatEther(transaction.value), [transaction.value]);
  return (
    <ListItem key={transaction.hash}>
      <ListItemAvatar>
        {isReceiver ? <TrendingUpIcon color="success" /> : <TrendingDownIcon color="error" />}
      </ListItemAvatar>
      <ListItemText primary={address} secondary={`${amount} ETH`} />
    </ListItem>
  );
};
