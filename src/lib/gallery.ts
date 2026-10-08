export function galleryImages(
  primary: string,
  images?: string[] | null
): string[] {
  return Array.from(
    new Set(
      [
        primary,
        ...(images ?? []),
      ].filter(Boolean)
    )
  );
}