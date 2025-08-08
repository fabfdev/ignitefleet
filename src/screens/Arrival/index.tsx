import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ControlIcon, XIcon } from "phosphor-react-native";
import { LatLng } from "react-native-maps";

import {
  AsyncMessage,
  Container,
  Content,
  Description,
  Footer,
  Label,
  LicensePlate,
} from "./styles";

import { useHistoric } from "../../hooks/useHistoric";
import { useLog } from "../../hooks/useLog";
import { useAuth } from "../../hooks/useAuth";

import { Header } from "../../components/Header";
import { Button } from "../../components/Button";
import { ButtonIcon } from "../../components/ButtonIcon";
import { Historic } from "../../libs/watermelon/models/Historic";

import { stopLocationTask } from "../../tasks/backgroundLocationTask";
import { getStorageLocations, removeStorageLocations } from "../../libs/asyncStorage/locationStorage";
import { Map } from "../../components/Map";

type RouteParamProps = {
  id: string;
};

export function Arrival() {
  const route = useRoute();
  const { getHistoricById, deleteHistoric, updateHistoric } = useHistoric();
  const { getLastSyncedTime } = useLog();
  const { user } = useAuth();
  const { goBack } = useNavigation();

  const [historic, setHistoric] = useState<Historic | null>(null);
  const [dataNotSynced, setDataNotSynced] = useState(false);
  const [coordinates, setCoordinates] = useState<LatLng[]>([]);

  const { id } = route.params as RouteParamProps;

  function handleRemoveVehicleUsage() {
    Alert.alert("Cancelar", "Cancelar a utilização do veículo?", [
      { text: "Não", style: "cancel" },
      { text: "Sim", onPress: () => removeVehicleUsage() },
    ]);
  }

  async function removeVehicleUsage() {
    await deleteHistoric(id);
    await removeStorageLocations();
    goBack();
  }

  async function handleArrivalRegister() {
    try {
      if (!historic) {
        return Alert.alert(
          "Erro",
          "Erro ao obter dados para chegada do veículo"
        );
      }

      await updateHistoric(id, { status: "arrival", updated_at: new Date() });
      
      await stopLocationTask();

      Alert.alert("Chegada", "Chegada registrada com sucesso!");

      goBack();
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchHistoric() {
    try {
      const data = await getHistoricById(id);
      setHistoric(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchLastTimeSync() {
    try {
      const data = await getLastSyncedTime({ user_id: user?.uid || "" });
      if (historic?.updated_at && data.updated_at) {
        setDataNotSynced(
          historic?.updated_at.getTime() > data.updated_at.getTime()
        );
      }

      const locations = await getStorageLocations();
      setCoordinates(locations);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchHistoric();
  }, [id]);

  useEffect(() => {
    fetchLastTimeSync();
  }, [user, historic]);

  return (
    <Container>
      <Header
        title={historic?.status === "departure" ? "Chegada" : "Detalhes"}
      />

      {coordinates.length > 0 && <Map coords={coordinates} />}

      <Content>
        <Label>Placa do veículo</Label>

        <LicensePlate>{historic?.license_plate}</LicensePlate>

        <Label>Finalidade</Label>

        <Description>{historic?.description}</Description>
      </Content>

      {historic?.status === "departure" && (
        <Footer>
          <ButtonIcon icon={XIcon} onPress={handleRemoveVehicleUsage} />
          <Button title="Registrar chegada" onPress={handleArrivalRegister} />
        </Footer>
      )}

      {dataNotSynced && (
        <AsyncMessage>
          Sincronização da{" "}
          {historic?.status === "departure" ? " partida" : "chegada"} pendente
        </AsyncMessage>
      )}
    </Container>
  );
}
