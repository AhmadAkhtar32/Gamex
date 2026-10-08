
/**
 * GameX - Admin Gallery Handler
 *
 * Handles additional product and custom-build images.
 * Shared by product and build server actions.
 */

type GalleryEntry =
  | {
      type: "url";
      url: string;
    }
  | {
      type: "file";
      index: number;
    };

const MAX_TOTAL_IMAGES = 10;
const MAX_ADDITIONAL_IMAGES = MAX_TOTAL_IMAGES - 1;

function isValidImageUrl(value: string): boolean {
  if (!value || value.length > 1000) {
    return false;
  }

  // Existing uploaded files may use local paths.
  if (
    value.startsWith("/") &&
    !value.startsWith("//")
  ) {
    return true;
  }

  try {
    const parsed = new URL(value);

    return (
      parsed.protocol === "https:" ||
      parsed.protocol === "http:"
    );
  } catch {
    return false;
  }
}

function parseGalleryManifest(
  raw: string
): GalleryEntry[] {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(
      "Invalid gallery data. Please try again."
    );
  }

  if (!Array.isArray(parsed)) {
    throw new Error(
      "Gallery data must be an array."
    );
  }

  if (parsed.length > MAX_ADDITIONAL_IMAGES) {
    throw new Error(
      `You can add up to ${MAX_ADDITIONAL_IMAGES} additional images.`
    );
  }

  const entries: GalleryEntry[] = [];

  for (const item of parsed) {
    if (
      typeof item !== "object" ||
      item === null
    ) {
      throw new Error("Invalid gallery entry.");
    }

    if (
      "type" in item &&
      item.type === "url" &&
      "url" in item &&
      typeof item.url === "string"
    ) {
      const url = item.url.trim();

      if (!isValidImageUrl(url)) {
        throw new Error(
          "One or more gallery image URLs are invalid."
        );
      }

      entries.push({
        type: "url",
        url,
      });

      continue;
    }

    if (
      "type" in item &&
      item.type === "file" &&
      "index" in item &&
      typeof item.index === "number" &&
      Number.isInteger(item.index) &&
      item.index >= 0
    ) {
      entries.push({
        type: "file",
        index: item.index,
      });

      continue;
    }

    throw new Error(
      "Invalid image reference in gallery."
    );
  }

  return entries;
}

/**
 * Resolves a complete gallery using:
 *
 * 1. Primary product/build image
 * 2. Existing additional image URLs
 * 3. Newly uploaded additional images
 *
 * Returns cover + additional images in the
 * selected order, without duplicates.
 */
export async function resolveGalleryImages(
  formData: FormData,
  primary: string,
  previous: string[],
  upload: (file: File) => Promise<string>
): Promise<string[]> {
  const coverImage = primary?.trim() ?? "";

  const existingImages = Array.isArray(previous)
    ? previous
        .filter(
          (image): image is string =>
            typeof image === "string" &&
            image.trim().length > 0
        )
        .map((image) => image.trim())
    : [];

  const manifestValue = formData.get(
    "galleryManifest"
  );

  // Backward compatibility for forms without
  // the additional-images editor.
  if (typeof manifestValue !== "string") {
    return Array.from(
      new Set(
        [coverImage, ...existingImages].filter(Boolean)
      )
    ).slice(0, MAX_TOTAL_IMAGES);
  }

  const manifest = parseGalleryManifest(
    manifestValue
  );

  const uploadedFiles = formData
    .getAll("galleryFiles")
    .filter(
      (value): value is File =>
        value instanceof File &&
        value.size > 0
    );

  const additionalImages: string[] = [];

  for (const entry of manifest) {
    let imageUrl: string;

    if (entry.type === "url") {
      imageUrl = entry.url;
    } else {
      const selectedFile =
        uploadedFiles[entry.index];

      if (!selectedFile) {
        throw new Error(
          "A gallery image file is missing. Please select it again."
        );
      }

      if (
        !selectedFile.type.startsWith("image/")
      ) {
        throw new Error(
          "Only image files can be uploaded."
        );
      }

      imageUrl = await upload(selectedFile);
    }

    const normalizedUrl = imageUrl.trim();

    if (
      normalizedUrl &&
      normalizedUrl !== coverImage &&
      !additionalImages.includes(normalizedUrl)
    ) {
      additionalImages.push(normalizedUrl);
    }
  }

  if (
    additionalImages.length >
    MAX_ADDITIONAL_IMAGES
  ) {
    throw new Error(
      `Maximum ${MAX_TOTAL_IMAGES} images are allowed, including the cover.`
    );
  }

  return [
    ...(coverImage ? [coverImage] : []),
    ...additionalImages,
  ];
}
