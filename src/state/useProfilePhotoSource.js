import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { fetchProfilePhotoBlob, profilePhotoSource } from "../services/api";

// Fonte da foto de perfil autenticada. No Android/iOS o <Image> envia o cabeçalho Authorization;
// na web isso não acontece, então a foto é baixada como Blob e exibida por uma URL local temporária.
// A versão (photoVersion) muda a cada troca ou remoção e força o recarregamento imediato.
export function useProfilePhotoSource(version, hasPhoto) {
  const [webUri, setWebUri] = useState(null);
  const isWeb = Platform.OS === "web";

  useEffect(() => {
    if (!isWeb || !hasPhoto) {
      setWebUri(null);
      return undefined;
    }
    let active = true;
    let objectUrl = null;
    fetchProfilePhotoBlob(version)
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        if (active) setWebUri(objectUrl);
        else URL.revokeObjectURL(objectUrl);
      })
      .catch(() => { if (active) setWebUri(null); });
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [isWeb, hasPhoto, version]);

  if (!hasPhoto) return null;
  if (!isWeb) return profilePhotoSource(version);
  return webUri ? { uri: webUri } : null;
}
