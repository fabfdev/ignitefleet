import { TouchableOpacityProps } from "react-native";
import { useTheme } from "styled-components/native";
import { KeyIcon, CarIcon } from "phosphor-react-native";

import { Container, IconBox, Message, MessageHighlight } from "./styles";

type Props = TouchableOpacityProps & {
  licensePlate?: string | null;
};

export function CarStatus({ licensePlate = null, ...rest }: Props) {
  const theme = useTheme();
  const Icon = licensePlate ? CarIcon : KeyIcon;
  const message = licensePlate ? `Veículo ${licensePlate} em uso. ` : `Nenhum veículo em uso. `;
  const status = licensePlate ? "chegada" : "saída";

  return (
    <Container {...rest}>
      <IconBox>
        <Icon size={32} color={theme.COLORS.BRAND_LIGHT} />
      </IconBox>

      <Message>
        {message}

        <MessageHighlight>
            Clique aqui para registrar a {status}
        </MessageHighlight>
      </Message>
    </Container>
  );
}
