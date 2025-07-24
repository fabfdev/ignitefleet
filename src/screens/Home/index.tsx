import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";

import { useAuth } from "../../hooks/useAuth";

import { CarStatus } from "../../components/CarStatus";
import { HomeHeader } from "../../components/HomeHeader";

import { Container, Content, Label, Title } from "./styles";
import { Historic } from "../../libs/watermelon/models/Historic";
import { useHistoric } from "../../hooks/useHistoric";
import { HistoricCard, HistoricCardProps } from "../../components/HistoricCard";

export function Home() {
  const [currentVehicle, setCurrentVehicle] = useState<Historic | null>(null);
  const [arrivalVehicles, setArrivalVehicles] = useState<HistoricCardProps[]>(
    []
  );

  const { user } = useAuth();
  const { navigate } = useNavigation();
  const { observeHistoricByStatus } = useHistoric();

  function handleRegisterMovement() {
    if (currentVehicle?.id) {
      return navigate("arrival", { id: currentVehicle.id });
    }
    navigate("departure");
  }

  function handleHistoricDetails(id: string) {
    return navigate("arrival", { id });
  }

  useEffect(() => {
    const subscription = observeHistoricByStatus(
      user!.uid,
      "departure"
    ).subscribe((historicList) => {
      setCurrentVehicle(historicList[0]);
    });

    return () => subscription.unsubscribe();
  }, [user]);

  useEffect(() => {
    const subscription = observeHistoricByStatus(
      user!.uid,
      "arrival"
    ).subscribe((historicList) => {
      const data = historicList.map((item) => {
        return {
          id: item.id,
          licensePlate: item.license_plate,
          isSync: false,
          created: dayjs(item.created_at).format(
            "[Saída em] DD/MM/YYYY [às] HH:mm"
          ),
        };
      });
      setArrivalVehicles(data);
    });

    return () => subscription.unsubscribe();
  }, [user]);

  return (
    <Container>
      <HomeHeader />

      <Content>
        <CarStatus
          licensePlate={currentVehicle?.license_plate}
          onPress={handleRegisterMovement}
        />

        <Title>Histórico</Title>

        <FlatList
          data={arrivalVehicles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HistoricCard
              data={item}
              onPress={() => handleHistoricDetails(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={<Label>Nenhum veículo sendo utilizado</Label>}
        />
      </Content>
    </Container>
  );
}
