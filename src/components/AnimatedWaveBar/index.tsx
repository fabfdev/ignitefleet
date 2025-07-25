import { useEffect } from "react";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "styled-components/native";

import { styles } from "./styles";

export function AnimatedWaveBar() {
  const progress = useSharedValue(0);

  const { COLORS } = useTheme();

  const animatedStyle = useAnimatedStyle(() => {
    // cria uma cor oscilando entre verde escuro e claro
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [COLORS.BRAND_LIGHT, COLORS.GRAY_700] // verde normal → verde claro
    );

    return { backgroundColor };
  });

  useEffect(() => {
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0, { duration: 1500 })
      ),
      -1,
      false
    );
  }, []);

  return <Animated.View style={[styles.bar, animatedStyle]} />;
}
