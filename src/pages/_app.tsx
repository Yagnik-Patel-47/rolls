import "../styles/globals.css";
import type { AppProps } from "next/app";
import { FC } from "react";
import { auth } from "../firebase";
import SignIn from "../components/SignIn";
import { useAuthState } from "react-firebase-hooks/auth";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import store from "../redux/store";
import { Provider } from "react-redux";

const MyApp: FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  const [user] = useAuthState(auth);
  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  if (!user) return <SignIn />;

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </ThemeProvider>
  );
};

export default MyApp;
