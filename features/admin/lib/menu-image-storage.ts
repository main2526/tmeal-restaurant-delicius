import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export const MENU_IMAGES_BUCKET = "menu-images";
export const MENU_IMAGE_MAX_SIZE = 5 * 1024 * 1024;
export const MENU_IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";

const extensionsByMimeType: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function validateMenuImage(file: File) {
  if (!extensionsByMimeType[file.type]) {
    return "Usa una imagen JPG, PNG o WebP.";
  }

  if (file.size > MENU_IMAGE_MAX_SIZE) {
    return "La imagen no puede pesar más de 5 MB.";
  }

  return null;
}

export async function uploadMenuImage(file: File) {
  const validationError = validateMenuImage(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    throw new Error("Supabase no está configurado para subir imágenes.");
  }

  const extension = extensionsByMimeType[file.type];
  const filePath = `menu-items/${crypto.randomUUID()}.${extension}`;
  const { data, error } = await supabase.storage
    .from(MENU_IMAGES_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(
      "No se pudo subir la imagen. Verifica que el almacenamiento esté configurado e inténtalo nuevamente.",
    );
  }

  const { data: publicUrlData } = supabase.storage
    .from(MENU_IMAGES_BUCKET)
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}
