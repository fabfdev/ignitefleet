import { StatusBar } from "react-native";
import { ThemeProvider } from "styled-components/native";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { AuthContextProvider } from "./src/contexts/AuthContext";

import theme from "./src/theme";

import { SignIn } from "./src/screens/SignIn";
import { Home } from "./src/screens/Home";

import { Loading } from "./src/components/Loading";

import { useAuth } from "./src/hooks/useAuth";

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  const { initializing } = useAuth();

  if (!fontsLoaded || initializing) {
    return <Loading />;
  }

  return (
    <ThemeProvider theme={theme}>
      <AuthContextProvider fallback={SignIn}>
        <StatusBar
          barStyle={"light-content"}
          backgroundColor={"transparent"}
          translucent
        />
        <Home />
      </AuthContextProvider>
    </ThemeProvider>
  );
}
