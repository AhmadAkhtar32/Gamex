"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Eye,
  EyeOff,
  ImageIcon,
  LinkIcon,
  Loader2,
  Save,
  Trash2,
  Upload,
  Video,
} from "lucide-react";

import {
  createHeroMedia,
  deleteHeroMedia,
  getHeroMediaUploadSignature,
  toggleHeroMediaVisibility,
  updateHeroMedia,
  type HeroMediaType,
} from "./actions";

/* =========================================================
   TYPES
   ========================================================= */

export type AdminHeroMediaItem = {
  id: number;

  mediaType: string;

  url: string;

  alt: string;

  isVisible: boolean;

  sortOrder: number;
};

/* =========================================================
   CONSTANTS
   ========================================================= */

const MAX_MEDIA_ITEMS =
  10;

const MAX_IMAGE_BYTES =
  10 *
  1024 *
  1024;

const MAX_VIDEO_BYTES =
  100 *
  1024 *
  1024;

const inputClass = `
  w-full
  rounded-xl

  border
  border-brand/15

  bg-white

  px-4
  py-3

  text-sm
  text-brand-deep

  outline-none

  transition-all

  placeholder:text-slate-400

  focus:border-brand/50

  focus:shadow-[0_0_0_4px_rgba(230,0,0,0.08)]
`;

/* =========================================================
   HERO MEDIA MANAGER
   ========================================================= */

export function HeroMediaManager({
  items,
}: {
  items: AdminHeroMediaItem[];
}) {
  const router =
    useRouter();

  const [
    mediaType,
    setMediaType,
  ] =
    useState<HeroMediaType>(
      "image"
    );

  const [
    url,
    setUrl,
  ] =
    useState("");

  const [
    alt,
    setAlt,
  ] =
    useState("");

  const [
    file,
    setFile,
  ] =
    useState<File | null>(
      null
    );

  const [
    busy,
    setBusy,
  ] =
    useState(false);

  const [
    message,
    setMessage,
  ] =
    useState<{
      type:
        | "success"
        | "error";

      text: string;
    } | null>(
      null
    );

  /* =======================================================
     NEXT SORT ORDER
     ======================================================= */

  const nextSortOrder =
    useMemo(
      () => {
        if (
          items.length ===
          0
        ) {
          return 0;
        }

        return (
          Math.max(
            ...items.map(
              (
                item
              ) =>
                item.sortOrder
            )
          ) + 1
        );
      },
      [
        items,
      ]
    );

  const atLimit =
    items.length >=
    MAX_MEDIA_ITEMS;

  /* =======================================================
     FILE SELECT
     ======================================================= */

  function onFileChange(
    selectedFile:
      | File
      | null
  ) {
    setMessage(
      null
    );

    if (
      !selectedFile
    ) {
      setFile(
        null
      );

      return;
    }

    const detectedType:
      HeroMediaType =
      selectedFile.type.startsWith(
        "video/"
      )
        ? "video"
        : "image";

    /* IMAGE TYPE */

    if (
      detectedType ===
        "image" &&
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/avif",
      ].includes(
        selectedFile.type
      )
    ) {
      setFile(
        null
      );

      setMessage({
        type:
          "error",

        text:
          "Images must be JPG, PNG, WebP or AVIF.",
      });

      return;
    }

    /* VIDEO TYPE */

    if (
      detectedType ===
        "video" &&
      ![
        "video/mp4",
        "video/webm",
      ].includes(
        selectedFile.type
      )
    ) {
      setFile(
        null
      );

      setMessage({
        type:
          "error",

        text:
          "Videos must be MP4 or WebM.",
      });

      return;
    }

    /* IMAGE SIZE */

    if (
      detectedType ===
        "image" &&
      selectedFile.size >
        MAX_IMAGE_BYTES
    ) {
      setFile(
        null
      );

      setMessage({
        type:
          "error",

        text:
          "Image must be 10 MB or smaller.",
      });

      return;
    }

    /* VIDEO SIZE */

    if (
      detectedType ===
        "video" &&
      selectedFile.size >
        MAX_VIDEO_BYTES
    ) {
      setFile(
        null
      );

      setMessage({
        type:
          "error",

        text:
          "Video must be 100 MB or smaller.",
      });

      return;
    }

    setMediaType(
      detectedType
    );

    setFile(
      selectedFile
    );
  }

  /* =======================================================
     DIRECT CLOUDINARY UPLOAD
     ======================================================= */

  async function uploadFile(
    selectedFile: File,
    type: HeroMediaType
  ) {
    const config =
      await getHeroMediaUploadSignature(
        type
      );

    const uploadData =
      new FormData();

    uploadData.append(
      "file",
      selectedFile
    );

    uploadData.append(
      "api_key",
      config.apiKey
    );

    uploadData.append(
      "timestamp",
      String(
        config.timestamp
      )
    );

    uploadData.append(
      "folder",
      config.folder
    );

    uploadData.append(
      "signature",
      config.signature
    );

    const response =
      await fetch(
        `https://api.cloudinary.com/v1_1/${config.cloudName}/${config.resourceType}/upload`,
        {
          method:
            "POST",

          body:
            uploadData,
        }
      );

    const result =
      (await response.json()) as {
        secure_url?: string;

        error?: {
          message?: string;
        };
      };

    if (
      !response.ok ||
      !result.secure_url
    ) {
      throw new Error(
        result.error?.message ||
          "Cloudinary upload failed."
      );
    }

    return result.secure_url;
  }

  /* =======================================================
     ADD MEDIA
     ======================================================= */

  async function addMedia() {
    if (atLimit) {
      setMessage({
        type:
          "error",

        text:
          "The Hero slider already has 10 media items.",
      });

      return;
    }

    if (
      !file &&
      !url.trim()
    ) {
      setMessage({
        type:
          "error",

        text:
          "Choose a file or enter a media URL.",
      });

      return;
    }

    setBusy(
      true
    );

    setMessage(
      null
    );

    try {
      let finalUrl =
        url.trim();

      /*
       * PC upload takes priority over URL.
       */
      if (file) {
        finalUrl =
          await uploadFile(
            file,
            mediaType
          );
      }

      await createHeroMedia({
        mediaType,

        url:
          finalUrl,

        alt,

        sortOrder:
          nextSortOrder,
      });

      setFile(
        null
      );

      setUrl(
        ""
      );

      setAlt(
        ""
      );

      const fileInput =
        document.getElementById(
          "heroMediaFile"
        ) as
          | HTMLInputElement
          | null;

      if (
        fileInput
      ) {
        fileInput.value =
          "";
      }

      setMessage({
        type:
          "success",

        text:
          "Hero media added.",
      });

      router.refresh();
    } catch (
      error
    ) {
      setMessage({
        type:
          "error",

        text:
          error instanceof Error
            ? error.message
            : "Could not add Hero media.",
      });
    } finally {
      setBusy(
        false
      );
    }
  }

  /* =======================================================
     UI
     ======================================================= */

  return (
    <div className="space-y-6">
      {/* =====================================================
          ADD MEDIA PANEL
          ===================================================== */}

      <div
        className="
          rounded-2xl

          border
          border-brand/10

          bg-[#fffafa]

          p-5

          sm:p-6
        "
      >
        {/* HEADER */}

        <div
          className="
            flex

            flex-col

            gap-3

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <p
              className="
                font-display

                text-base

                font-extrabold

                uppercase

                text-brand-deep
              "
            >
              Hero Slider Media
            </p>

            <p
              className="
                mt-1

                text-xs

                leading-relaxed

                text-slate-500
              "
            >
              Add up to 10 images or videos. Images auto-slide;
              videos play muted and advance when finished.
            </p>
          </div>

          <span
            className="
              inline-flex

              w-fit

              rounded-full

              bg-brand

              px-3
              py-1.5

              text-[10px]

              font-extrabold

              uppercase

              tracking-wider

              text-white
            "
          >
            {items.length} / {MAX_MEDIA_ITEMS}
          </span>
        </div>

        {/* ===================================================
            TYPE + DESCRIPTION
            =================================================== */}

        <div
          className="
            mt-5

            grid

            gap-5

            lg:grid-cols-2
          "
        >
          {/* TYPE */}

          <div>
            <label
              className="
                mb-2

                block

                text-[10px]

                font-extrabold

                uppercase

                tracking-[0.15em]

                text-brand-deep
              "
            >
              Media Type
            </label>

            <div
              className="
                grid

                grid-cols-2

                gap-2
              "
            >
              <button
                type="button"
                onClick={() => {
                  setMediaType(
                    "image"
                  );

                  setFile(
                    null
                  );
                }}
                disabled={
                  busy
                }
                className={`
                  inline-flex
                  items-center
                  justify-center
                  gap-2

                  rounded-xl

                  border

                  px-4
                  py-3

                  text-xs
                  font-bold
                  uppercase
                  tracking-wider

                  transition-all

                  ${
                    mediaType ===
                    "image"
                      ? "border-brand bg-brand text-white"
                      : "border-brand/15 bg-white text-brand-deep hover:border-brand/40"
                  }
                `}
              >
                <ImageIcon className="h-4 w-4" />

                Image
              </button>

              <button
                type="button"
                onClick={() => {
                  setMediaType(
                    "video"
                  );

                  setFile(
                    null
                  );
                }}
                disabled={
                  busy
                }
                className={`
                  inline-flex
                  items-center
                  justify-center
                  gap-2

                  rounded-xl

                  border

                  px-4
                  py-3

                  text-xs
                  font-bold
                  uppercase
                  tracking-wider

                  transition-all

                  ${
                    mediaType ===
                    "video"
                      ? "border-brand bg-brand text-white"
                      : "border-brand/15 bg-white text-brand-deep hover:border-brand/40"
                  }
                `}
              >
                <Video className="h-4 w-4" />

                Video
              </button>
            </div>
          </div>

          {/* DESCRIPTION */}

          <div>
            <label
              htmlFor="heroMediaAlt"
              className="
                mb-2

                block

                text-[10px]

                font-extrabold

                uppercase

                tracking-[0.15em]

                text-brand-deep
              "
            >
              Description / Alt Text
            </label>

            <input
              id="heroMediaAlt"
              value={
                alt
              }
              onChange={(
                event
              ) =>
                setAlt(
                  event
                    .target
                    .value
                )
              }
              maxLength={
                500
              }
              placeholder="Example: Gamex RGB gaming PC"
              className={
                inputClass
              }
              disabled={
                busy
              }
            />
          </div>
        </div>

        {/* ===================================================
            FILE UPLOAD
            =================================================== */}

        <div className="mt-5">
          <label
            htmlFor="heroMediaFile"
            className="
              mb-2

              block

              text-[10px]

              font-extrabold

              uppercase

              tracking-[0.15em]

              text-brand-deep
            "
          >
            Upload From PC
          </label>

          <label
            htmlFor="heroMediaFile"
            className="
              flex

              cursor-pointer

              items-center

              gap-3

              rounded-xl

              border
              border-dashed
              border-brand/25

              bg-white

              px-4
              py-4

              transition-all

              hover:border-brand/50

              hover:bg-brand/[0.025]
            "
          >
            <span
              className="
                grid

                h-10
                w-10

                shrink-0

                place-items-center

                rounded-xl

                bg-brand/[0.08]

                text-brand
              "
            >
              <Upload className="h-5 w-5" />
            </span>

            <span className="min-w-0">
              <span
                className="
                  block

                  truncate

                  text-sm

                  font-bold

                  text-brand-deep
                "
              >
                {file
                  ? file.name
                  : mediaType ===
                      "image"
                    ? "Choose JPG, PNG, WebP or AVIF"
                    : "Choose MP4 or WebM video"}
              </span>

              <span
                className="
                  mt-1

                  block

                  text-xs

                  text-slate-400
                "
              >
                {mediaType ===
                "image"
                  ? "Maximum 10 MB"
                  : "Maximum 100 MB — uploaded directly to Cloudinary"}
              </span>
            </span>

            <input
              key={
                mediaType
              }
              id="heroMediaFile"
              type="file"
              accept={
                mediaType ===
                "image"
                  ? "image/jpeg,image/png,image/webp,image/avif"
                  : "video/mp4,video/webm"
              }
              onChange={(
                event
              ) =>
                onFileChange(
                  event
                    .target
                    .files?.[0] ??
                    null
                )
              }
              className="sr-only"
              disabled={
                busy ||
                atLimit
              }
            />
          </label>
        </div>

        {/* ===================================================
            OR
            =================================================== */}

        <div
          className="
            my-4

            flex

            items-center

            gap-3
          "
        >
          <span className="h-px flex-1 bg-brand/10" />

          <span
            className="
              text-[10px]

              font-extrabold

              uppercase

              tracking-wider

              text-slate-400
            "
          >
            Or
          </span>

          <span className="h-px flex-1 bg-brand/10" />
        </div>

        {/* URL */}

        <div className="relative">
          <LinkIcon
            className="
              pointer-events-none

              absolute

              left-4
              top-1/2

              h-4
              w-4

              -translate-y-1/2

              text-slate-400
            "
          />

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
            placeholder={
              mediaType ===
              "image"
                ? "https://.../hero-image.webp"
                : "https://.../hero-video.mp4"
            }
            className={`${inputClass} pl-11`}
            disabled={
              busy ||
              Boolean(
                file
              )
            }
          />
        </div>

        {/* MESSAGE */}

        {message ? (
          <div
            className={`
              mt-4

              rounded-xl

              border

              px-4
              py-3

              text-sm

              font-semibold

              ${
                message.type ===
                "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }
            `}
          >
            {message.text}
          </div>
        ) : null}

        {/* ADD */}

        <button
          type="button"
          onClick={
            addMedia
          }
          disabled={
            busy ||
            atLimit
          }
          className="
            mt-5

            inline-flex

            items-center
            justify-center

            gap-2

            rounded-xl

            bg-brand

            px-5
            py-3

            text-xs

            font-bold

            uppercase

            tracking-wider

            text-white

            transition-all

            hover:bg-[#c90000]

            disabled:cursor-not-allowed

            disabled:opacity-50
          "
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}

          {busy
            ? "Uploading..."
            : "Add to Slider"}
        </button>
      </div>

      {/* =====================================================
          EXISTING MEDIA
          ===================================================== */}

      {items.length >
      0 ? (
        <div
          className="
            grid

            gap-5

            lg:grid-cols-2
          "
        >
          {items.map(
            (
              item
            ) => (
              <HeroMediaItemCard
                key={
                  item.id
                }
                item={
                  item
                }
              />
            )
          )}
        </div>
      ) : (
        <div
          className="
            rounded-2xl

            border
            border-dashed
            border-brand/20

            bg-white

            px-6
            py-10

            text-center
          "
        >
          <ImageIcon
            className="
              mx-auto

              h-8
              w-8

              text-brand/50
            "
          />

          <p
            className="
              mt-3

              font-display

              text-sm

              font-bold

              uppercase

              text-brand-deep
            "
          >
            No Slider Media Yet
          </p>

          <p
            className="
              mt-2

              text-xs

              leading-relaxed

              text-slate-500
            "
          >
            Add an image or video above. Until then, the
            homepage uses the existing Hero image as a
            temporary fallback.
          </p>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   MEDIA CARD
   ========================================================= */

function HeroMediaItemCard({
  item,
}: {
  item: AdminHeroMediaItem;
}) {
  const router =
    useRouter();

  const [
    alt,
    setAlt,
  ] =
    useState(
      item.alt
    );

  const [
    sortOrder,
    setSortOrder,
  ] =
    useState(
      String(
        item.sortOrder
      )
    );

  const [
    busy,
    setBusy,
  ] =
    useState(
      false
    );

  const [
    error,
    setError,
  ] =
    useState(
      ""
    );

  const isVideo =
    item.mediaType ===
    "video";

  /* =======================================================
     SAVE
     ======================================================= */

  async function saveItem() {
    setBusy(
      true
    );

    setError(
      ""
    );

    try {
      const parsedOrder =
        Number.parseInt(
          sortOrder,
          10
        );

      await updateHeroMedia({
        id:
          item.id,

        alt,

        sortOrder:
          Number.isFinite(
            parsedOrder
          )
            ? parsedOrder
            : 0,

        isVisible:
          item.isVisible,
      });

      router.refresh();
    } catch (
      saveError
    ) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Could not update this item."
      );
    } finally {
      setBusy(
        false
      );
    }
  }

  /* =======================================================
     TOGGLE
     ======================================================= */

  async function toggleVisibility() {
    setBusy(
      true
    );

    setError(
      ""
    );

    try {
      await toggleHeroMediaVisibility(
        item.id
      );

      router.refresh();
    } catch (
      toggleError
    ) {
      setError(
        toggleError instanceof Error
          ? toggleError.message
          : "Could not change visibility."
      );
    } finally {
      setBusy(
        false
      );
    }
  }

  /* =======================================================
     DELETE
     ======================================================= */

  async function removeItem() {
    if (
      !window.confirm(
        "Delete this Hero slider item?"
      )
    ) {
      return;
    }

    setBusy(
      true
    );

    setError(
      ""
    );

    try {
      await deleteHeroMedia(
        item.id
      );

      router.refresh();
    } catch (
      deleteError
    ) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete this item."
      );
    } finally {
      setBusy(
        false
      );
    }
  }

  return (
    <div
      className="
        overflow-hidden

        rounded-2xl

        border
        border-black/[0.07]

        bg-white

        shadow-[0_18px_50px_-40px_rgba(230,0,0,0.35)]
      "
    >
      {/* PREVIEW */}

      <div
        className="
          relative

          aspect-[16/10]

          overflow-hidden

          bg-[#111]
        "
      >
        {isVideo ? (
          <video
            src={
              item.url
            }
            muted
            playsInline
            controls
            preload="metadata"
            className="
              h-full
              w-full

              object-contain
            "
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={
              item.url
            }
            alt={
              item.alt
            }
            className="
              h-full
              w-full

              object-contain
            "
          />
        )}

        <span
          className="
            absolute

            left-3
            top-3

            inline-flex

            items-center

            gap-1.5

            rounded-full

            bg-brand

            px-2.5
            py-1

            text-[9px]

            font-extrabold

            uppercase

            tracking-wider

            text-white
          "
        >
          {isVideo ? (
            <Video className="h-3 w-3" />
          ) : (
            <ImageIcon className="h-3 w-3" />
          )}

          {item.mediaType}
        </span>

        {!item.isVisible ? (
          <span
            className="
              absolute

              right-3
              top-3

              rounded-full

              bg-black/75

              px-2.5
              py-1

              text-[9px]

              font-extrabold

              uppercase

              tracking-wider

              text-white
            "
          >
            Hidden
          </span>
        ) : null}
      </div>

      {/* EDIT */}

      <div className="p-5">
        <div
          className="
            grid

            gap-4

            sm:grid-cols-[1fr_110px]
          "
        >
          <div>
            <label
              className="
                mb-2

                block

                text-[9px]

                font-extrabold

                uppercase

                tracking-wider

                text-slate-500
              "
            >
              Description / Alt
            </label>

            <input
              value={
                alt
              }
              onChange={(
                event
              ) =>
                setAlt(
                  event
                    .target
                    .value
                )
              }
              maxLength={
                500
              }
              className={
                inputClass
              }
              disabled={
                busy
              }
            />
          </div>

          <div>
            <label
              className="
                mb-2

                block

                text-[9px]

                font-extrabold

                uppercase

                tracking-wider

                text-slate-500
              "
            >
              Order
            </label>

            <input
              value={
                sortOrder
              }
              onChange={(
                event
              ) =>
                setSortOrder(
                  event
                    .target
                    .value
                )
              }
              type="number"
              min={
                0
              }
              max={
                9999
              }
              className={
                inputClass
              }
              disabled={
                busy
              }
            />
          </div>
        </div>

        <p
          className="
            mt-3

            truncate

            text-[10px]

            text-slate-400
          "
        >
          {item.url}
        </p>

        {error ? (
          <p
            className="
              mt-3

              rounded-lg

              bg-red-50

              px-3
              py-2

              text-xs

              font-semibold

              text-red-700
            "
          >
            {error}
          </p>
        ) : null}

        <div
          className="
            mt-4

            flex

            flex-wrap

            gap-2
          "
        >
          <button
            type="button"
            onClick={
              saveItem
            }
            disabled={
              busy
            }
            className="
              inline-flex

              items-center

              gap-2

              rounded-lg

              bg-brand

              px-3.5
              py-2.5

              text-[10px]

              font-bold

              uppercase

              tracking-wider

              text-white

              transition-all

              hover:bg-[#c90000]

              disabled:opacity-50
            "
          >
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}

            Save
          </button>

          <button
            type="button"
            onClick={
              toggleVisibility
            }
            disabled={
              busy
            }
            className="
              inline-flex

              items-center

              gap-2

              rounded-lg

              border
              border-brand/15

              bg-white

              px-3.5
              py-2.5

              text-[10px]

              font-bold

              uppercase

              tracking-wider

              text-brand

              transition-all

              hover:border-brand

              hover:bg-brand/[0.04]

              disabled:opacity-50
            "
          >
            {item.isVisible ? (
              <EyeOff className="h-3.5 w-3.5" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}

            {item.isVisible
              ? "Hide"
              : "Show"}
          </button>

          <button
            type="button"
            onClick={
              removeItem
            }
            disabled={
              busy
            }
            className="
              inline-flex

              items-center

              gap-2

              rounded-lg

              border
              border-red-200

              bg-white

              px-3.5
              py-2.5

              text-[10px]

              font-bold

              uppercase

              tracking-wider

              text-red-600

              transition-all

              hover:bg-red-50

              disabled:opacity-50
            "
          >
            <Trash2 className="h-3.5 w-3.5" />

            Delete
          </button>
        </div>
      </div>
    </div>
  );
}