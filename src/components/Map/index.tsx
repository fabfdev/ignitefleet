import { useRef } from "react";
import MapView, {
  LatLng,
  MapViewProps,
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { IconBox } from "../IconBox";
import { CarIcon, FlagCheckeredIcon } from "phosphor-react-native";
import { useTheme } from "styled-components/native";

type Props = MapViewProps & {
  coords: LatLng[];
};

export function Map({ coords, ...rest }: Props) {
  const mapRef = useRef<MapView>(null);

  const { COLORS } = useTheme();

  const lastCoord = coords[coords.length - 1];

  async function onMapLoaded() {
    if (coords.length > 1) {
      mapRef.current?.fitToSuppliedMarkers(["departure", "arrival"], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      });
    }
  }

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={{ width: "100%", height: 200 }}
      region={{
        latitude: lastCoord.latitude,
        longitude: lastCoord.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
      onMapLoaded={onMapLoaded}
      {...rest}
    >
      <Marker identifier="departure" coordinate={coords[0]}>
        <IconBox size="SMALL" icon={CarIcon} />
      </Marker>

      {coords.length > 1 && (
        <>
          <Marker identifier="arrival" coordinate={lastCoord}>
            <IconBox size="SMALL" icon={FlagCheckeredIcon} />
          </Marker>

          <Polyline
            coordinates={[...coords]}
            strokeColor={COLORS.GRAY_700}
            strokeWidth={7}
          />
        </>
      )}
    </MapView>
  );
}
