import { useEffect, useRef, useState } from "react";
import {
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  LocationAccuracy,
  LocationObjectCoords,
  LocationSubscription,
  useForegroundPermissions,
  requestBackgroundPermissionsAsync,
  watchPositionAsync,
} from "expo-location";
import { CarIcon } from "phosphor-react-native";

import { Container, Content, Message, MessageContent } from "./styles";

import { useHistoric } from "../../hooks/useHistoric";
import { useAuth } from "../../hooks/useAuth";
import { useDatabase } from "../../hooks/useDatabase";

import { Header } from "../../components/Header";
import { LicensePlateInput } from "../../components/LicensePlateInput";
import { TextAreaInput } from "../../components/TextAreaInput";
import { Button } from "../../components/Button";
import { Loading } from "../../components/Loading";
import { LocationInfo } from "../../components/LocationInfo";
import { Map } from "../../components/Map";

import { licensePlateValidate } from "../../utils/licensePlateValidate";
import { getAddressLocation } from "../../utils/getAddressLocation";
import { openSettings } from "../../utils/openSettings";
import { startLocationTask } from "../../tasks/backgroundLocationTask";
import { Location } from "../../libs/watermelon/models/Location";

const keyboardAvoidingViewBehavior =
  Platform.OS === "android" ? "height" : "position";

export function Departures() {
  const descriptionRef = useRef<TextInput>(null);
  const licensePlateRef = useRef<TextInput>(null);

  const [licensePlate, setLicensePlate] = useState("");
  const [description, setDescription] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [currentCoords, setCurrentCoords] =
    useState<LocationObjectCoords | null>(null);

  const { createHistoric } = useHistoric();
  const { user } = useAuth();
  const { goBack } = useNavigation();
  const [locationForegroundPermission, requestLocationForegroundPermission] =
    useForegroundPermissions();
  const { database } = useDatabase(); // remove it from here

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

      if (!currentCoords?.latitude && !currentCoords?.longitude) {
        return Alert.alert("Localização", "coordenadas inválidas");
      }

      setIsRegistering(true);

      const backgroundPermissions = await requestBackgroundPermissionsAsync();

      if (!backgroundPermissions.granted) {
        setIsRegistering(false);
        return Alert.alert(
          "Localização",
          "permissão em background não aceita",
          [
            {
              text: "Abrir configurações",
              onPress: openSettings,
            },
          ]
        );
      }

      const historic = await createHistoric({
        user_id: user!.uid,
        license_plate: licensePlate,
        description: description,
        status: "departure",
      });

      await database.write(async () => {
        return await database.get<Location>("location").create((location) => {
          location.latitude = currentCoords.latitude;
          location.longitude = currentCoords.longitude;
          location.timestamp = new Date();

          location.historic.set(historic);
        });
      });

      await startLocationTask();

      Alert.alert("Saída", "Saída do veículo registrada!");

      return goBack();
    } catch (error) {
      setIsRegistering(false);
      console.error(error);
      return Alert.alert(
        "Erro",
        "não foi possível registrar a saída do veículo"
      );
    }
  }

  useEffect(() => {
    requestLocationForegroundPermission();
  }, []);

  useEffect(() => {
    if (!locationForegroundPermission?.granted) {
      return;
    }

    let subscription: LocationSubscription;

    watchPositionAsync(
      {
        accuracy: LocationAccuracy.High,
        timeInterval: 1000,
      },
      (location) => {
        setCurrentCoords(location.coords);

        getAddressLocation(location.coords)
          .then((address) => {
            if (address) {
              setCurrentAddress(address);
            }
          })
          .finally(() => setIsLoadingLocation(false));
      }
    ).then((response) => (subscription = response));

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [locationForegroundPermission?.granted]);

  if (!locationForegroundPermission?.granted) {
    return (
      <Container>
        <Header title="Saída" />

        <MessageContent>
          <Message>
            Você precisa permitir que o aplicativo tenha acesso a localização
            para utilizar essa funcionalidade. Por favor, acesse as
            configurações do seu dispositivo para conceder essa permissão ao
            aplicativo
          </Message>

          <Button title="Abrir configurações" onPress={openSettings} />
        </MessageContent>
      </Container>
    );
  }

  if (isLoadingLocation) {
    return <Loading />;
  }

  return (
    <Container>
      <Header title="Saída" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={keyboardAvoidingViewBehavior}
      >
        <ScrollView>
          {currentCoords && <Map coords={[currentCoords]} />}
          <Content>
            {currentAddress && (
              <LocationInfo
                icon={CarIcon}
                label="Localização atual"
                description={currentAddress}
              />
            )}

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
