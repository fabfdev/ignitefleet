import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { XIcon } from "phosphor-react-native";

import {
  Container,
  Content,
  Description,
  Footer,
  Label,
  LicensePlate,
} from "./styles";

import { useHistoric } from "../../hooks/useHistoric";

import { Header } from "../../components/Header";
import { Button } from "../../components/Button";
import { ButtonIcon } from "../../components/ButtonIcon";
import { Historic } from "../../libs/watermelon/models/Historic";

type RouteParamProps = {
  id: string;
};

export function Arrival() {
  const route = useRoute();
  const { getHistoricById, deleteHistoric } = useHistoric();
  const { goBack } = useNavigation();

  const [historic, setHistoric] = useState<Historic | null>(null);

  const { id } = route.params as RouteParamProps;

  function handleRemoveVehicleUsage() {
    Alert.alert(
      "Cancelar",
      "Cancelar a utilização do veículo?",
      [
        { text: "Não", style: "cancel" },
        { text: "Sim", onPress: () => removeVehicleUsage() }
      ]
    )
  }

  async function removeVehicleUsage() {
    await deleteHistoric(id);
    goBack();
  }

  async function fetchHistoric() {
    try {
      const data = await getHistoricById(id);
      setHistoric(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchHistoric();
  }, []);

  return (
    <Container>
      <Header title="Chegada" />
      <Content>
        <Label>Placa do veículo</Label>

        <LicensePlate>{historic?.license_plate}</LicensePlate>

        <Label>Finalidade</Label>

        <Description>{historic?.description}</Description>

        <Footer>
          <ButtonIcon icon={XIcon} onPress={handleRemoveVehicleUsage} />
          <Button title="Registrar chegada" />
        </Footer>
      </Content>
    </Container>
  );
}
