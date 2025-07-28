import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import Toast from "react-native-toast-message";

import { useAuth } from "../../hooks/useAuth";
import { useDatabase } from "../../hooks/useDatabase";
import { useHistoric } from "../../hooks/useHistoric";
import { useLog } from "../../hooks/useLog";

import { CarStatus } from "../../components/CarStatus";
import { HomeHeader } from "../../components/HomeHeader";

import { Container, Content, Label, Title } from "./styles";
import { Historic } from "../../libs/watermelon/models/Historic";
import { HistoricCard, HistoricCardProps } from "../../components/HistoricCard";
import { AnimatedWaveBar } from "../../components/AnimatedWaveBar";

export function Home() {
  const [currentVehicle, setCurrentVehicle] = useState<Historic | null>(null);
  const [arrivalVehicles, setArrivalVehicles] = useState<HistoricCardProps[]>(
    []
  );
  const [lastSyncedTime, setLastSyncedTime] = useState<Date | null>(null);

  const { user } = useAuth();
  const { navigate } = useNavigation();
  const { isSyncing, syncData } = useDatabase();
  const { observeHistoricByStatus } = useHistoric();
  const { getLastSyncedTime } = useLog();

  function handleRegisterMovement() {
    if (currentVehicle?.id) {
      return navigate("arrival", { id: currentVehicle.id });
    }
    navigate("departure");
  }

  function handleHistoricDetails(id: string) {
    return navigate("arrival", { id });
  }

  async function fetchLastSyncedTime() {
    const lastLog = await getLastSyncedTime({ user_id: user!.uid });
    setLastSyncedTime(lastLog.updated_at);
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
          isSync: lastSyncedTime
            ? lastSyncedTime.getTime() > item.updated_at.getTime()
            : false,
          created: dayjs(item.created_at).format(
            "[Saída em] DD/MM/YYYY [às] HH:mm"
          ),
        };
      });
      setArrivalVehicles(data);
    });

    return () => subscription.unsubscribe();
  }, [user, lastSyncedTime]);

  useEffect(() => {
    fetchLastSyncedTime();
  }, [user]);

  useEffect(() => {
    if (isSyncing) {
      Toast.show({
        type: "info",
        text1: "Todos os dados estão sendo sincronizados",
      });
    } else {
      Toast.show({
        type: "info",
        text1: "Todos os dados estão sincronizados",
      });
    }
  }, [isSyncing]);

  return (
    <Container>
      <HomeHeader />

      {isSyncing && <AnimatedWaveBar />}

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
