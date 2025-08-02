import { StatusBar } from "react-native";
import { ThemeProvider } from "styled-components/native";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { WifiSlashIcon } from "phosphor-react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import "./src/libs/dayjs";

import { AuthContextProvider } from "./src/contexts/AuthContext";
import { DatabaseContextProvider } from "./src/contexts/DatabaseContext";

import theme from "./src/theme";

import { SignIn } from "./src/screens/SignIn";

import { Loading } from "./src/components/Loading";
import { TopMessage } from "./src/components/TopMessage";

import { useAuth } from "./src/hooks/useAuth";
import { Routes } from "./src/routes";

// Desabilitar warnings de depreciação do Firebase
(globalThis as any).RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });
  const netInfo = useNetInfo();

  const { initializing } = useAuth();

  if (!fontsLoaded || initializing) {
    return <Loading />;
  }

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider
        style={{ flex: 1, backgroundColor: theme.COLORS.GRAY_800 }}
      >
        {!netInfo.isConnected && (
          <TopMessage title="Você está off-line." icon={WifiSlashIcon} />
        )}
        <AuthContextProvider fallback={SignIn}>
          <DatabaseContextProvider>
            <StatusBar
              barStyle={"light-content"}
              backgroundColor={"transparent"}
              translucent
            />
            <Routes />
          </DatabaseContextProvider>
        </AuthContextProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
