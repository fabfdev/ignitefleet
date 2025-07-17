import { useState } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "@react-native-firebase/auth";

import { WEB_CLIENT_ID, IOS_CLIENT_ID } from "@env";

import { Container, Slogan, Title } from "./styles";

import backgroundImg from "../../assets/background.png";

import { Button } from "../../components/Button";

GoogleSignin.configure({
  scopes: ["email", "profile"],
  webClientId: WEB_CLIENT_ID,
  iosClientId: IOS_CLIENT_ID,
});

export function SignIn() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  async function handleGoogleSignIn() {
    try {
      setIsAuthenticating(true);

      await GoogleSignin.hasPlayServices();
      const { data } = await GoogleSignin.signIn();
      const idToken = data?.idToken;

      if (idToken) {
        const googleCredential = GoogleAuthProvider.credential(idToken);
        const auth = getAuth();

        const result = await signInWithCredential(auth, googleCredential);

        return result;
      } else {
        throw new Error("No ID token found");
      }
    } catch (error) {
      console.log(error);
      setIsAuthenticating(false);
    }
  }

  return (
    <Container source={backgroundImg}>
      <Title>Ignite Fleet</Title>
      <Slogan>Gestão de uso de veículos</Slogan>

      <Button
        title="Entrar com Google"
        isLoading={isAuthenticating}
        onPress={handleGoogleSignIn}
      />
    </Container>
  );
}
