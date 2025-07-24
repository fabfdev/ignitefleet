import { StatusBar } from "react-native";
import { ThemeProvider } from "styled-components/native";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./src/libs/dayjs";

import { AuthContextProvider } from "./src/contexts/AuthContext";
import { DatabaseProvider } from "./src/libs/watermelon/provider/DatabaseProvider";

import theme from "./src/theme";

import { SignIn } from "./src/screens/SignIn";

import { Loading } from "./src/components/Loading";

import { useAuth } from "./src/hooks/useAuth";
import { Routes } from "./src/routes";

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  const { initializing } = useAuth();

  if (!fontsLoaded || initializing) {
    return <Loading />;
  }

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider style={{ flex: 1, backgroundColor: theme.COLORS.GRAY_800 }}>
        <DatabaseProvider>
          <AuthContextProvider fallback={SignIn}>
            <StatusBar
              barStyle={"light-content"}
              backgroundColor={"transparent"}
              translucent
            />
            <Routes />
          </AuthContextProvider>
        </DatabaseProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
