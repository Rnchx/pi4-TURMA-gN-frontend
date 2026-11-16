import { useEffect, useState } from "react";
import { Image, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import PressableScale from "./ui/PressableScale";
import { useAuth } from "../state/AuthContext";
import { useProfilePhotoSource } from "../state/useProfilePhotoSource";
import { StyleSheet, colors, radius, spacing } from "../theme";

const SIZE = 38;

// Foto de perfil no cabeçalho (à direita do carrinho). A fonte depende de photoVersion: ao substituir
// ou remover a foto, o AuthContext incrementa a versão e a imagem é recarregada imediatamente.
// Sem foto (ou se o download falhar), mostra o ícone de usuário. Área de toque de 48 × 48.
export default function HeaderProfileAvatar() {
  const navigation = useNavigation();
  const { usuario, photoVersion } = useAuth();
  const [failed, setFailed] = useState(false);
  useEffect(() => { setFailed(false); }, [photoVersion, usuario?.fotoPerfil]);
  const source = useProfilePhotoSource(photoVersion, Boolean(usuario?.fotoPerfil));
  const showPhoto = Boolean(source) && !failed;

  return (
    <PressableScale
      onPress={() => navigation.navigate("Profile")}
      accessibilityRole="button"
      accessibilityLabel={usuario?.nome ? `Abrir meu perfil, ${usuario.nome}` : "Abrir meu perfil"}
      style={styles.button}
    >
      <View style={styles.circle}>
        {showPhoto ? (
          <Image
            key={`foto-${photoVersion}`}
            source={source}
            style={styles.photo}
            resizeMode="cover"
            onError={() => setFailed(true)}
            accessibilityIgnoresInvertColors
          />
        ) : (
          <MaterialCommunityIcons name="account" size={24} color={colors.onHeader} />
        )}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create(({ colors: c }) => ({
  button: { width: 48, height: 48, alignItems: "center", justifyContent: "center", marginRight: spacing.xs },
  circle: {
    width: SIZE, height: SIZE, borderRadius: radius.pill, overflow: "hidden", alignItems: "center", justifyContent: "center",
    backgroundColor: c.primaryDetail, borderWidth: 2, borderColor: c.accentOnPrimary,
  },
  photo: { width: "100%", height: "100%" },
}));
