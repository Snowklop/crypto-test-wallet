import { Grid } from '@mui/material';
import { Assets } from '../assets/Assets.container';
import { DiscoverTokens } from '../assets/DiscoverTokens.container';
import { History } from '../history/History.container';
import { AccountSelector } from './AccountSelector.component';

export const AuthorizedLayout = () => (
  <>
    <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center">
      <Grid item xs={6} marginTop={5} marginBottom={5}>
        <AccountSelector />
      </Grid>
    </Grid>
    <DiscoverTokens />
    <Grid container direction="row" justifyContent="center" sx={{ height: '80%' }}>
      <Grid item md={6} xs={12} sx={{ p: 5, paddingBottom: 1 }}>
        <Assets />
      </Grid>
      <Grid item md={6} xs={12} sx={{ p: 5, paddingBottom: 1 }}>
        <History />
      </Grid>
    </Grid>
  </>
);
