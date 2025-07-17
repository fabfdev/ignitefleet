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

import { Loading } from "./src/components/Loading";
import { UserProvider } from "@realm/react";

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  if (!fontsLoaded) {
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
      </AuthContextProvider>
    </ThemeProvider>
  );
}
