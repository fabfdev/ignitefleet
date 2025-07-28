import { TouchableOpacity } from "react-native";
import { PowerIcon } from "phosphor-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Container, Greeting, Message, Name, Picture } from "./styles";

import { useAuth } from "../../hooks/useAuth";

import theme from "../../theme";

import defaultImg from "../../../assets/icon.png";
import { useHistoric } from "../../hooks/useHistoric";

export function HomeHeader() {
  const insets = useSafeAreaInsets();

  const { user, signOut } = useAuth();
  const { deleteAllHistoric } = useHistoric();

  const paddingTop = insets.top + 32;

  async function signOutApp() {
    try {
      await deleteAllHistoric({ user_id: user?.uid || "" });
      signOut();
    } catch (error) {
      console.error(error);
    }
  }

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

      <TouchableOpacity onPress={signOutApp} activeOpacity={0.7}>
        <PowerIcon size={32} color={theme.COLORS.GRAY_400} />
      </TouchableOpacity>
    </Container>
  );
}
