import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { useEffect } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { LoadingContent } from '../../components/LoadingContent';
import { selectActiveAccount } from '../login/loginSlice';
import { AssetCard } from './AssetCard.container';
import { loadAssets, loadBalancesAsync, selectAssets, selectAssetsLoading } from './assetsSlice';
import { AddAssetDialog } from './AddAssetDialog.container';

export const Assets = () => {
  const dispatch = useAppDispatch();
  const selectedAccount = useAppSelector(selectActiveAccount);
  const assets = useAppSelector(selectAssets);
  const areAssetsLoading = useAppSelector(selectAssetsLoading);
  useEffect(() => {
    if (selectedAccount) {
      dispatch(loadAssets(selectedAccount));
      dispatch(loadBalancesAsync(selectedAccount));
    }
  }, [selectedAccount, dispatch]);
  return (
    <Accordion defaultExpanded variant="outlined">
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Tokens</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ overflow: 'auto', maxHeight: '70vh' }}>
        <LoadingContent isLoading={areAssetsLoading}>
          {!Object.keys(assets).length && <Typography align="center">No tokens found</Typography>}
          {Object.entries(assets).map(([tokenAddress, asset]) => (
            <AssetCard key={tokenAddress} address={tokenAddress} symbol={asset.symbol} name={asset.name} />
          ))}
          <AddAssetDialog />
        </LoadingContent>
      </AccordionDetails>
    </Accordion>
  );
};
