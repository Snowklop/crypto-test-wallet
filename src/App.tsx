import { useAppSelector } from "./app/hooks";
import { selectIsConnected } from "./features/login/loginSlice";
import { AuthorizedLayout } from "./features/login/Authorized.layout";
import { Login } from "./features/login/Login.container";
import { Grid } from "@mui/material";

function App() {
  const isConnected = useAppSelector(selectIsConnected);
  return (
    <Grid container sx={{ height: "100vh" }}>
      {isConnected ? <AuthorizedLayout /> : <Login />}
    </Grid>
  );
}

export default App;
