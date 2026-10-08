"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  Trash2,
} from "lucide-react";

type ImageEntry =
  | {
      id: string;
      type: "url";
      url: string;
    }
  | {
      id: string;
      type: "file";
      file: File;
      preview: string;
    };

/** Additional images only; the existing cover-image field remains the primary photo. */
export function AdditionalImagesEditor({
  existingImages = [],
}: {
  existingImages?: string[];
}) {
  const [
    entries,
    setEntries,
  ] =
    useState<
      ImageEntry[]
    >(() =>
      existingImages.map(
        (
          url,
          index
        ) => ({
          id: `existing-${index}`,
          type:
            "url",
          url,
        })
      )
    );

  const [
    url,
    setUrl,
  ] =
    useState("");

  const [
    error,
    setError,
  ] =
    useState("");

  const inputRef =
    useRef<HTMLInputElement>(
      null
    );

  const previewUrls =
    useRef<string[]>(
      []
    );

  useEffect(() => {
    if (
      !inputRef.current
    ) {
      return;
    }

    const dt =
      new DataTransfer();

    for (
      const entry
      of entries
    ) {
      if (
        entry.type ===
        "file"
      ) {
        dt.items.add(
          entry.file
        );
      }
    }

    inputRef.current.files =
      dt.files;
  }, [
    entries,
  ]);

  useEffect(
    () => () => {
      previewUrls.current.forEach(
        (
          preview
        ) =>
          URL.revokeObjectURL(
            preview
          )
      );
    },
    []
  );

  const manifest =
    entries.map(
      (
        entry
      ) =>
        entry.type ===
        "url"
          ? {
              type:
                "url",
              url:
                entry.url,
            }
          : {
              type:
                "file",
              index:
                entries
                  .filter(
                    (
                      current
                    ) =>
                      current.type ===
                      "file"
                  )
                  .indexOf(
                    entry
                  ),
            }
    );

  function addFiles(
    files: FileList | null
  ) {
    if (
      !files?.length
    ) {
      return;
    }

    const selected =
      Array.from(
        files
      );

    if (
      selected.some(
        (
          file
        ) =>
          ![
            "image/jpeg",
            "image/png",
            "image/webp",
          ].includes(
            file.type
          ) ||
          file.size >
            5 *
              1024 *
              1024
      )
    ) {
      setError(
        "Only JPG, PNG or WebP files up to 5 MB each are allowed."
      );

      return;
    }

    if (
      entries.length +
        selected.length >
      9
    ) {
      setError(
        "Up to 10 photos total, including the cover image."
      );

      return;
    }

    const additions: ImageEntry[] =
      selected.map(
        (
          file
        ) => {
          const preview =
            URL.createObjectURL(
              file
            );

          previewUrls.current.push(
            preview
          );

          return {
            id:
              crypto.randomUUID(),
            type:
              "file",
            file,
            preview,
          };
        }
      );

    setEntries(
      (
        current
      ) => [
        ...current,
        ...additions,
      ]
    );

    setError(
      ""
    );
  }

  function addUrl() {
    const candidate =
      url.trim();

    try {
      const parsed =
        new URL(
          candidate
        );

      if (
        ![
          "https:",
          "http:",
        ].includes(
          parsed.protocol
        ) ||
        candidate.length >
          1000
      ) {
        throw new Error();
      }
    } catch {
      setError(
        "Enter a valid http/https image URL (maximum 1000 characters)."
      );

      return;
    }

    if (
      entries.length >=
      9
    ) {
      setError(
        "Up to 10 photos total, including the cover image."
      );

      return;
    }

    setEntries(
      (
        current
      ) => [
        ...current,
        {
          id:
            crypto.randomUUID(),
          type:
            "url",
          url:
            candidate,
        },
      ]
    );

    setUrl(
      ""
    );

    setError(
      ""
    );
  }

  function move(
    index: number,
    step: number
  ) {
    setEntries(
      (
        current
      ) => {
        const copy =
          [
            ...current,
          ];

        [
          copy[
            index
          ],
          copy[
            index +
              step
          ],
        ] = [
          copy[
            index +
              step
          ],
          copy[
            index
          ],
        ];

        return copy;
      }
    );
  }

  return (
    <section className="mt-6 rounded-2xl border border-brand/15 bg-white p-4 md:p-5">
      <h3 className="font-display text-sm font-bold uppercase text-brand-deep">
        Additional gallery photos
      </h3>

      <p className="mt-1 text-xs text-slate-500">
        The cover image above shows first. Add up to 9 more
        photos, remove them or change their display order.
      </p>

      <input
        type="hidden"
        name="galleryManifest"
        value={
          JSON.stringify(
            manifest
          )
        }
        readOnly
      />

      <label className="mt-4 block cursor-pointer rounded-xl border border-dashed border-brand/30 bg-[#fff8f8] px-4 py-4 text-center text-sm font-semibold text-brand">
        <ImagePlus className="mr-2 inline h-5 w-5" />

        Select multiple images

        <input
          ref={
            inputRef
          }
          name="galleryFiles"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(
            event
          ) =>
            addFiles(
              event
                .target
                .files
            )
          }
          className="sr-only"
        />
      </label>

      <div className="mt-3 flex gap-2">
        <input
          type="url"
          value={
            url
          }
          onChange={(
            event
          ) =>
            setUrl(
              event
                .target
                .value
            )
          }
          maxLength={
            1000
          }
          placeholder="Or paste another image URL"
          className="min-w-0 flex-1 rounded-lg border border-brand/15 px-3 py-2 text-sm"
        />

        <button
          type="button"
          onClick={
            addUrl
          }
          className="rounded-lg bg-brand px-4 py-2 text-xs font-bold text-white"
        >
          Add URL
        </button>
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-2 text-sm text-red-600"
        >
          {
            error
          }
        </p>
      ) : null}

      {entries.length >
      0 ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {entries.map(
            (
              entry,
              index
            ) => (
              <div
                key={
                  entry.id
                }
                className="rounded-xl border border-brand/10 p-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    entry.type ===
                    "url"
                      ? entry.url
                      : entry.preview
                  }
                  alt={`Gallery photo ${
                    index +
                    2
                  }`}
                  className="h-24 w-full rounded-lg bg-slate-50 object-contain"
                />

                <p className="mt-1 truncate text-[11px] text-slate-500">
                  Photo{" "}
                  {
                    index +
                    2
                  }
                </p>

                <div className="mt-2 flex justify-between gap-1">
                  <button
                    type="button"
                    aria-label="Move photo earlier"
                    disabled={
                      index ===
                      0
                    }
                    onClick={() =>
                      move(
                        index,
                        -1
                      )
                    }
                    className="rounded-md border p-1 disabled:opacity-30"
                  >
                    <ArrowUp
                      size={
                        15
                      }
                    />
                  </button>

                  <button
                    type="button"
                    aria-label="Move photo later"
                    disabled={
                      index ===
                      entries.length -
                        1
                    }
                    onClick={() =>
                      move(
                        index,
                        1
                      )
                    }
                    className="rounded-md border p-1 disabled:opacity-30"
                  >
                    <ArrowDown
                      size={
                        15
                      }
                    />
                  </button>

                  <button
                    type="button"
                    aria-label="Remove photo"
                    onClick={() =>
                      setEntries(
                        (
                          current
                        ) =>
                          current.filter(
                            (
                              currentEntry
                            ) =>
                              currentEntry.id !==
                              entry.id
                          )
                      )
                    }
                    className="rounded-md border p-1 text-red-600"
                  >
                    <Trash2
                      size={
                        15
                      }
                    />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      ) : null}
    </section>
  );
}