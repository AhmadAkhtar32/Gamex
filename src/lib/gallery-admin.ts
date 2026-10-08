/** Server-only gallery parser, shared by products and custom builds. */
export async function resolveGalleryImages(
  formData: FormData,
  primary: string,
  previous: string[],
  upload: (file: File) => Promise<string>
): Promise<string[]> {
  const raw =
    formData.get(
      "galleryManifest"
    );

  if (
    typeof raw !==
    "string"
  ) {
    return [
      primary,
      ...previous.filter(
        (url) =>
          url &&
          url !==
            primary
      ),
    ];
  }

  let manifest: unknown;

  try {
    manifest =
      JSON.parse(
        raw
      );
  } catch {
    throw new Error(
      "Invalid gallery data."
    );
  }

  if (
    !Array.isArray(
      manifest
    ) ||
    manifest.length >
      9
  ) {
    throw new Error(
      "A listing can have up to 10 images, including its cover."
    );
  }

  const uploads =
    formData
      .getAll(
        "galleryFiles"
      )
      .filter(
        (
          file
        ): file is File =>
          file instanceof
            File &&
          file.size >
            0
      );

  const additional: string[] =
    [];

  for (
    const entry
    of manifest
  ) {
    if (
      !entry ||
      typeof entry !==
        "object"
    ) {
      throw new Error(
        "Invalid gallery image."
      );
    }

    let image: string;

    if (
      "type" in
        entry &&
      entry.type ===
        "url" &&
      "url" in
        entry &&
      typeof entry.url ===
        "string"
    ) {
      image =
        entry.url.trim();

      if (
        image.length >
        1000
      ) {
        throw new Error(
          "An image URL is too long."
        );
      }

      try {
        const parsed =
          new URL(
            image
          );

        if (
          parsed.protocol !==
            "https:" &&
          parsed.protocol !==
            "http:"
        ) {
          throw new Error();
        }
      } catch {
        throw new Error(
          "Enter a valid gallery image URL."
        );
      }
    } else if (
      "type" in
        entry &&
      entry.type ===
        "file" &&
      "index" in
        entry &&
      Number.isInteger(
        entry.index
      ) &&
      typeof entry.index ===
        "number" &&
      entry.index >=
        0 &&
      entry.index <
        uploads.length
    ) {
      image =
        await upload(
          uploads[
            entry.index
          ]
        );
    } else {
      throw new Error(
        "Invalid gallery file reference."
      );
    }

    if (
      image !==
        primary &&
      !additional.includes(
        image
      )
    ) {
      additional.push(
        image
      );
    }
  }

  return [
    primary,
    ...additional,
  ];
}