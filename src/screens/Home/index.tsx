import { useAuth } from "../../hooks/useAuth";
import { Container, SignOutButton, SignOutText } from "./styles";

export function Home() {
  const { signOut } = useAuth();

  return (
    <Container>
      <SignOutButton onPress={signOut}>
        <SignOutText>Deslogar</SignOutText>
      </SignOutButton>
    </Container>
  );
}
