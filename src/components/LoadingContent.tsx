import { CircularProgress, Grid } from "@mui/material";
import { PropsWithChildren } from "react";

type Props = {
  isLoading: boolean;
};

export const LoadingContent = ({
  isLoading,
  children,
}: PropsWithChildren<Props>) => (
  <>
    {isLoading ? (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />
      </Grid>
    ) : (
      children
    )}
  </>
);
