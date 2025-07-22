import { useRef, useState } from "react";
import {
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Container, Content } from "./styles";

import { useHistoric } from "../../hooks/useHistoric";
import { useAuth } from "../../hooks/useAuth";

import { Header } from "../../components/Header";
import { LicensePlateInput } from "../../components/LicensePlateInput";
import { TextAreaInput } from "../../components/TextAreaInput";
import { Button } from "../../components/Button";
import { licensePlateValidate } from "../../utils/licensePlateValidate";

const keyboardAvoidingViewBehavior =
  Platform.OS === "android" ? "height" : "position";

export function Departures() {
  const descriptionRef = useRef<TextInput>(null);
  const licensePlateRef = useRef<TextInput>(null);

  const [licensePlate, setLicensePlate] = useState("");
  const [description, setDescription] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const { createHistoric } = useHistoric();
  const { user } = useAuth();
  const { goBack } = useNavigation();

  async function handleDepartureRegister() {
    try {
      if (!licensePlateValidate(licensePlate)) {
        licensePlateRef.current?.focus();
        return Alert.alert("Placa é inválida", "Placa inválida");
      }

      if (description.trim().length === 0) {
        descriptionRef.current?.focus();
        return Alert.alert("Finalidade", "finalidade inválida");
      }

      setIsRegistering(true);

      await createHistoric({
        user_id: user!.uid,
        license_plate: licensePlate,
        description: description,
        status: "departure",
      });

      Alert.alert("Saída", "Saída do veículo registrada!");

      return goBack();
    } catch (error) {
      setIsRegistering(false);
      console.log(error);
      return Alert.alert(
        "Erro",
        "não foi possível registrar a saída do veículo"
      );
    }
  }

  return (
    <Container>
      <Header title="Saída" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={keyboardAvoidingViewBehavior}
      >
        <ScrollView>
          <Content>
            <LicensePlateInput
              ref={licensePlateRef}
              label="Placa do veículo"
              placeholder="BRA1234"
              onSubmitEditing={() => descriptionRef.current?.focus()}
              returnKeyType="next"
              onChangeText={setLicensePlate}
            />

            <TextAreaInput
              ref={descriptionRef}
              label="Finalidade"
              placeholder="Vou utilizar o veículo para…"
              onSubmitEditing={handleDepartureRegister}
              returnKeyType="send"
              submitBehavior="submit"
              onChangeText={setDescription}
            />

            <Button
              title="Registrar saída"
              onPress={handleDepartureRegister}
              isLoading={isRegistering}
            />
          </Content>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}
