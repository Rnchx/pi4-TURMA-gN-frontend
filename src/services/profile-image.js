import * as ImageManipulator from "expo-image-manipulator";

export const PROFILE_PHOTO_ORIGINAL_MAX_BYTES = 10 * 1024 * 1024;
export const PROFILE_PHOTO_MAX_BYTES = 10 * 1024 * 1024;

const attempts = [
  { maxDimension: 1024, compress: 0.82 },
  { maxDimension: 768, compress: 0.7 },
  { maxDimension: 512, compress: 0.58 },
];

function resizeAction(width, height, maxDimension) {
  if (width <= maxDimension && height <= maxDimension) return [];
  return width >= height ? [{ resize: { width: maxDimension } }] : [{ resize: { height: maxDimension } }];
}

// O picker pode entregar HEIC/HEIF, PNG, WebP ou JPEG. O manipulador decodifica o arquivo local,
// corrige a orientação e sempre grava um JPEG conhecido antes de qualquer validação de tamanho.
export async function processProfileImage(asset, crop) {
  if (!asset?.uri) throw new Error("Não foi possível ler a imagem selecionada.");
  if (Number(asset.fileSize) > PROFILE_PHOTO_ORIGINAL_MAX_BYTES) {
    throw new Error("A foto original deve ter no máximo 10 MB.");
  }
  const cropAction = crop ? [{ crop }] : [];
  const sourceWidth = Number(crop?.width || asset.width) || 1024;
  const sourceHeight = Number(crop?.height || asset.height) || 1024;
  let lastSize = 0;
  for (const attempt of attempts) {
    const result = await ImageManipulator.manipulateAsync(
      asset.uri,
      [...cropAction, ...resizeAction(sourceWidth, sourceHeight, attempt.maxDimension)],
      { compress: attempt.compress, format: ImageManipulator.SaveFormat.JPEG },
    );
    const response = await fetch(result.uri);
    const blob = await response.blob();
    lastSize = blob.size;
    if (blob.size <= PROFILE_PHOTO_MAX_BYTES) {
      return { uri: result.uri, width: result.width, height: result.height, mimeType: "image/jpeg", blob };
    }
  }
  throw new Error("A foto processada ainda ficou acima de 10 MB (" + Math.ceil(lastSize / 1024) + " KB). Escolha outra imagem.");
}
