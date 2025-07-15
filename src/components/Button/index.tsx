import { TouchableOpacityProps } from "react-native";

import { Container, LoadingIndicator, Title } from "./styles";

type Props = TouchableOpacityProps & {
  title: string;
  isLoading?: boolean;
};

export function Button({ title, isLoading = false, ...rest }: Props) {
  return (
    <Container activeOpacity={0.7} disabled={isLoading} {...rest}>
      {isLoading ? <LoadingIndicator /> : <Title>{title}</Title>}
    </Container>
  );
}
