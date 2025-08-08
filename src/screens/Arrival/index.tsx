import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { LocationObjectCoords } from "expo-location";
import { useNavigation, useRoute } from "@react-navigation/native";
import { XIcon } from "phosphor-react-native";
import { LatLng } from "react-native-maps";
import dayjs from "dayjs";

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
import { useDatabase } from "../../hooks/useDatabase";

import { Header } from "../../components/Header";
import { Button } from "../../components/Button";
import { ButtonIcon } from "../../components/ButtonIcon";
import { Map } from "../../components/Map";
import { Locations } from "../../components/Locations";
import { LocationInfoProps } from "../../components/LocationInfo";

import { stopLocationTask } from "../../tasks/backgroundLocationTask";
import {
  getStorageLocations,
  removeStorageLocations,
} from "../../libs/asyncStorage/locationStorage";
import { Historic } from "../../libs/watermelon/models/Historic";
import { Location } from "../../libs/watermelon/models/Location";
import { getAddressLocation } from "../../utils/getAddressLocation";

type RouteParamProps = {
  id: string;
};

export function Arrival() {
  const route = useRoute();
  const { getHistoricById, deleteHistoric, updateHistoric } = useHistoric();
  const { getLastSyncedTime } = useLog();
  const { user } = useAuth();
  const { goBack } = useNavigation();
  const { database } = useDatabase();

  const [historic, setHistoric] = useState<Historic | null>(null);
  const [dataNotSynced, setDataNotSynced] = useState(false);
  const [coordinates, setCoordinates] = useState<LatLng[]>([]);
  const [departure, setDeparture] = useState<LocationInfoProps>(
    {} as LocationInfoProps
  );
  const [arrival, setArrival] = useState<LocationInfoProps | null>(null);

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

      const locations = await getStorageLocations();

      await database.write(async () => {
        // remove it from here
        locations.forEach(async (element: any) => {
          await database.get<Location>("location").create((location) => {
            location.latitude = element.latitude;
            location.longitude = element.longitude;
            location.timestamp = element.timestamp;

            location.historic.set(historic);
          });
        });
      });

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
      console.error(error);
    }
  }

  async function fetchStreeName() {
    try {
      if (coordinates.length > 0) {
        const departureStreeName = await getAddressLocation(
          coordinates[0] as LocationObjectCoords
        );
        setDeparture({
          label: `Saindo em ${departureStreeName ?? ""}`,
          description: dayjs(new Date()).format("DD/MM/YYYY [às] HH:mm"),
        });

        if (historic?.status === "arrival") {
          const arrivalStreeName = await getAddressLocation(
            coordinates[coordinates.length - 1] as LocationObjectCoords
          );

          setArrival({
            label: `Chegando em ${arrivalStreeName ?? ""}`,
            description: dayjs(new Date()).format("DD/MM/YYYY [às] HH:mm"),
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchCoordinates() {
    try {
      if (historic?.status === "departure") {
        const locations = await getStorageLocations();
        setCoordinates(locations);
      } else {
        const coords = ((await historic?.location.fetch()) ?? []) as Location[];
        const locations: LatLng[] = coords.map((item) => ({
          latitude: item.latitude,
          longitude: item.longitude,
          timestamp: item.timestamp,
        }));
        setCoordinates(locations);
      }
    } catch (error) {
      console.error(error);
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

      fetchCoordinates();
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

  useEffect(() => {
    fetchStreeName();
  }, [coordinates]);

  return (
    <Container>
      <Header
        title={historic?.status === "departure" ? "Chegada" : "Detalhes"}
      />

      {coordinates.length > 0 && <Map coords={coordinates} />}

      <Content>
        <Locations departure={departure} arrival={arrival} />

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
