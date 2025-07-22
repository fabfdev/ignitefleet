import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useAuth } from "../../hooks/useAuth";
import { useHistoric } from "../../hooks/useHistoric";

import { CarStatus } from "../../components/CarStatus";
import { HomeHeader } from "../../components/HomeHeader";

import { Container, Content } from "./styles";
import { Historic } from "../../libs/watermelon/models/Historic";

export function Home() {
  const [currentVehicle, setCurrentVehicle] = useState<Historic | null>(null);

  const { user } = useAuth();
  const { navigate } = useNavigation();
  const { getHistoricByUserAndDeparture } = useHistoric();

  function handleRegisterMovement() {
    if (currentVehicle?.id) {
      return navigate("arrival", { id: currentVehicle.id });
    }
    navigate("departure");
  }

  async function fetchVehicle() {
    try {
      const historic = await getHistoricByUserAndDeparture(user!.uid);
      setCurrentVehicle(historic[0]);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Erro ao buscar veículo");
    }
  }

  useEffect(() => {
    fetchVehicle();
  }, []);

  return (
    <Container>
      <HomeHeader />

      <Content>
        <CarStatus
          licensePlate={currentVehicle?.license_plate}
          onPress={handleRegisterMovement}
        />
      </Content>
    </Container>
  );
}
