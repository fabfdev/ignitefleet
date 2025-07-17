import { HomeHeader } from "../../components/HomeHeader";
import { useAuth } from "../../hooks/useAuth";
import { Container } from "./styles";

export function Home() {
  const { signOut } = useAuth();

  return (
    <Container>
      <HomeHeader />
    </Container>
  );
}
