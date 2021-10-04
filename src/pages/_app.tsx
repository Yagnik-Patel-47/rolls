import "../styles/globals.css";
import type { AppProps } from "next/app";
import { FC } from "react";
import { auth } from "../firebase";
import SignIn from "../screens/SignIn";
import { useAuthState } from "react-firebase-hooks/auth";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import store from "../redux/store";
import Loading from "../screens/Loading";
import { Provider } from "react-redux";

const MyApp: FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  const [user, loading] = useAuthState(auth);
  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  if (loading) return <Loading />;

  if (!user)
    return (
      <Provider store={store}>
        <SignIn />
      </Provider>
    );

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </ThemeProvider>
  );
};

export default MyApp;
