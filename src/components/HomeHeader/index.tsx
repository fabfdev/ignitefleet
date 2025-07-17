import { TouchableOpacity } from "react-native";
import { PowerIcon } from "phosphor-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Container, Greeting, Message, Name, Picture } from "./styles";

import { useAuth } from "../../hooks/useAuth";

import theme from "../../theme";

import defaultImg from "../../../assets/icon.png";

export function HomeHeader() {
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();

  const paddingTop = insets.top + 32;

  return (
    <Container style={{ paddingTop: paddingTop }}>
      <Picture
        source={user?.photoURL ? { uri: user?.photoURL } : defaultImg}
        placeholder="L87wKDs:Mx#+}?$%V@niwHxDozX8"
      />

      <Greeting>
        <Message>Olá</Message>
        <Name>{user?.displayName}</Name>
      </Greeting>

      <TouchableOpacity onPress={signOut} activeOpacity={0.7}>
        <PowerIcon size={32} color={theme.COLORS.GRAY_400} />
      </TouchableOpacity>
    </Container>
  );
}
