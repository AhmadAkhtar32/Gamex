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
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function isValidImageUrl(value: string): boolean {
  if (
    !value ||
    value.length > 1000 ||
    /[\\\u0000-\u0020\u007f]/.test(value)
  ) {
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
      Number.isSafeInteger(item.index) &&
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

  if (!isValidImageUrl(coverImage)) {
    throw new Error(
      "A valid cover image is required."
    );
  }

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
  if (manifestValue === null) {
    const preservedImages = Array.from(
      new Set(
        [coverImage, ...existingImages].filter(Boolean)
      )
    );

    // Do not silently discard existing photos.
    if (preservedImages.length > MAX_TOTAL_IMAGES) {
      throw new Error(
        `Maximum ${MAX_TOTAL_IMAGES} images are allowed, including the cover. Remove extra images using the gallery editor.`
      );
    }

    return preservedImages;
  }

  if (typeof manifestValue !== "string") {
    throw new Error(
      "Invalid gallery data. Please try again."
    );
  }

  const manifest = parseGalleryManifest(
    manifestValue
  );

  // Keep original positions so manifest indexes
  // cannot shift when an invalid file is submitted.
  const uploadedFiles = formData.getAll(
    "galleryFiles"
  );

  const selectedFiles = new Map<number, File>();

  // Validate every referenced file before starting
  // any additional-image uploads.
  for (const entry of manifest) {
    if (entry.type !== "file") {
      continue;
    }

    const selectedFile = uploadedFiles[entry.index];

    if (
      !(selectedFile instanceof File) ||
      selectedFile.size === 0
    ) {
      throw new Error(
        "A gallery image file is missing or empty. Please select it again."
      );
    }

    if (!ALLOWED_IMAGE_TYPES.includes(selectedFile.type)) {
      throw new Error(
        "Only JPG, PNG and WebP images are allowed."
      );
    }

    if (selectedFile.size > MAX_IMAGE_SIZE) {
      throw new Error(
        "Each gallery image must be 5 MB or smaller."
      );
    }

    selectedFiles.set(entry.index, selectedFile);
  }

  const additionalImages: string[] = [];
  const uploadedUrls = new Map<number, string>();

  for (const entry of manifest) {
    let imageUrl: string;

    if (entry.type === "url") {
      imageUrl = entry.url;
    } else {
      const cachedUrl = uploadedUrls.get(entry.index);

      if (cachedUrl !== undefined) {
        imageUrl = cachedUrl;
      } else {
        const selectedFile = selectedFiles.get(entry.index);

        if (!selectedFile) {
          throw new Error(
            "A gallery image file is missing. Please select it again."
          );
        }

        imageUrl = await upload(selectedFile);

        if (
          typeof imageUrl !== "string" ||
          !isValidImageUrl(imageUrl.trim())
        ) {
          throw new Error(
            "A gallery image upload returned an invalid URL. Please try again."
          );
        }

        uploadedUrls.set(entry.index, imageUrl);
      }
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
    coverImage,
    ...additionalImages,
  ];
}