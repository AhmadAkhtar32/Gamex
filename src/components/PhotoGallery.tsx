"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  createPortal,
} from "react-dom";

import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minus,
  Plus,
  X,
} from "lucide-react";

/**
 * Shared gallery for:
 * - product detail pages
 * - build detail pages
 * - quick-view modal
 *
 * Main image click/tap opens full-screen viewer.
 * Viewer supports click/tap zoom plus +/- controls up to 400%.
 */
export function PhotoGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [
    selected,
    setSelected,
  ] =
    useState(
      0
    );

  const [
    lightbox,
    setLightbox,
  ] =
    useState(
      false
    );

  const [
    zoom,
    setZoom,
  ] =
    useState(
      1
    );

  const closeRef =
    useRef<HTMLButtonElement>(
      null
    );

  const photos =
    images.filter(
      Boolean
    );

  const count =
    photos.length;

  const select = (
    index: number
  ) => {
    if (
      count ===
      0
    ) {
      return;
    }

    setSelected(
      (
        index +
        count
      ) %
        count
    );

    setZoom(
      1
    );
  };

  useEffect(() => {
    if (
      !lightbox
    ) {
      return;
    }

    const oldOverflow =
      document.body
        .style
        .overflow;

    document.body.style.overflow =
      "hidden";

    closeRef.current?.focus();

    const selectOffset =
      (
        offset: number
      ) => {
        setSelected(
          (
            current
          ) =>
            (
              current +
              offset +
              count
            ) %
            count
        );

        setZoom(
          1
        );
      };

    const onKey =
      (
        event: KeyboardEvent
      ) => {
        if (
          event.key ===
          "Escape"
        ) {
          setLightbox(
            false
          );

          event.stopPropagation();
        }

        if (
          event.key ===
          "ArrowLeft"
        ) {
          selectOffset(
            -1
          );

          event.preventDefault();
        }

        if (
          event.key ===
          "ArrowRight"
        ) {
          selectOffset(
            1
          );

          event.preventDefault();
        }

        if (
          event.key ===
            "+" ||
          event.key ===
            "="
        ) {
          setZoom(
            (
              current
            ) =>
              Math.min(
                4,
                current +
                  0.5
              )
          );
        }

        if (
          event.key ===
          "-"
        ) {
          setZoom(
            (
              current
            ) =>
              Math.max(
                1,
                current -
                  0.5
              )
          );
        }
      };

    window.addEventListener(
      "keydown",
      onKey,
      true
    );

    return () => {
      document.body.style.overflow =
        oldOverflow;

      window.removeEventListener(
        "keydown",
        onKey,
        true
      );
    };
  }, [
    lightbox,
    count,
  ]);

  if (
    !count
  ) {
    return null;
  }

  const thumbnails =
    (
      large: boolean
    ) =>
      count >
        1 ? (
        <div
          aria-label={`${title} photo thumbnails`}
          className={`
            flex
            shrink-0
            gap-2
            overflow-x-auto
            p-2

            ${
              large
                ? "justify-center bg-black/90"
                : "bg-white/90"
            }
          `}
        >
          {photos.map(
            (
              src,
              index
            ) => (
              <button
                type="button"
                key={`${src}-${index}`}
                aria-label={`View photo ${
                  index +
                  1
                } of ${count}`}
                aria-current={
                  selected ===
                  index
                    ? "true"
                    : undefined
                }
                onClick={() =>
                  select(
                    index
                  )
                }
                className={`
                  h-14
                  w-14
                  shrink-0
                  overflow-hidden
                  rounded-lg
                  border-2
                  transition-colors

                  ${
                    selected ===
                    index
                      ? "border-red-600"
                      : large
                        ? "border-white/30"
                        : "border-slate-200"
                  }
                `}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    src
                  }
                  alt=""
                  className="
                    h-full
                    w-full
                    object-contain
                  "
                />
              </button>
            )
          )}
        </div>
      ) : null;

  return (
    <div
      className="
        relative
        flex
        h-full
        min-h-0
        w-full
        flex-col
        overflow-hidden
        rounded-xl
        bg-white
      "
    >
      <div
        className="
          relative
          min-h-0
          flex-1
        "
      >
        <button
          type="button"
          title="Open image and zoom"
          aria-label={`Enlarge ${title} photo ${
            selected +
            1
          }`}
          onClick={() =>
            setLightbox(
              true
            )
          }
          className="
            absolute
            inset-0
            flex
            w-full
            cursor-zoom-in
            items-center
            justify-center
          "
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              photos[
                selected
              ]
            }
            alt={`${title} - photo ${
              selected +
              1
            }`}
            className="
              h-full
              w-full
              object-contain
              p-3
            "
          />
        </button>

        <button
          type="button"
          onClick={() =>
            setLightbox(
              true
            )
          }
          aria-label="Zoom photo"
          className="
            absolute
            bottom-3
            right-3
            rounded-full
            border
            border-slate-200
            bg-white/95
            p-2
            text-slate-700
            shadow
          "
        >
          <Maximize2
            size={
              18
            }
          />
        </button>

        {count >
        1 ? (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() =>
                select(
                  selected -
                    1
                )
              }
              className="
                absolute
                left-2
                top-1/2
                -translate-y-1/2
                rounded-full
                bg-white/90
                p-2
                shadow
              "
            >
              <ChevronLeft
                size={
                  18
                }
              />
            </button>

            <button
              type="button"
              aria-label="Next photo"
              onClick={() =>
                select(
                  selected +
                    1
                )
              }
              className="
                absolute
                right-2
                top-1/2
                -translate-y-1/2
                rounded-full
                bg-white/90
                p-2
                shadow
              "
            >
              <ChevronRight
                size={
                  18
                }
              />
            </button>

            <span
              className="
                absolute
                bottom-3
                left-3
                rounded-full
                bg-black/65
                px-2
                py-1
                text-xs
                text-white
              "
            >
              {
                selected +
                1
              }{" "}
              /{" "}
              {
                count
              }
            </span>
          </>
        ) : null}
      </div>

      {
        thumbnails(
          false
        )
      }

      {lightbox &&
      typeof document !==
        "undefined"
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`${title} photo viewer`}
              className="
                fixed
                inset-0
                z-[400]
                flex
                flex-col
                bg-black/95
                text-white
              "
            >
              <div
                className="
                  flex
                  shrink-0
                  items-center
                  justify-between
                  gap-2
                  p-3
                "
              >
                <span
                  className="
                    min-w-0
                    truncate
                    text-sm
                    font-semibold
                  "
                >
                  {
                    title
                  }{" "}
                  ·{" "}
                  {
                    selected +
                    1
                  }{" "}
                  /{" "}
                  {
                    count
                  }
                </span>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <button
                    type="button"
                    aria-label="Zoom out"
                    disabled={
                      zoom <=
                      1
                    }
                    onClick={() =>
                      setZoom(
                        (
                          current
                        ) =>
                          Math.max(
                            1,
                            current -
                              0.5
                          )
                      )
                    }
                    className="
                      rounded-lg
                      border
                      border-white/30
                      p-2
                      disabled:opacity-30
                    "
                  >
                    <Minus
                      size={
                        19
                      }
                    />
                  </button>

                  <span className="w-10 text-center text-sm">
                    {Math.round(
                      zoom *
                        100
                    )}
                    %
                  </span>

                  <button
                    type="button"
                    aria-label="Zoom in"
                    disabled={
                      zoom >=
                      4
                    }
                    onClick={() =>
                      setZoom(
                        (
                          current
                        ) =>
                          Math.min(
                            4,
                            current +
                              0.5
                          )
                      )
                    }
                    className="
                      rounded-lg
                      border
                      border-white/30
                      p-2
                      disabled:opacity-30
                    "
                  >
                    <Plus
                      size={
                        19
                      }
                    />
                  </button>

                  <button
                    ref={
                      closeRef
                    }
                    type="button"
                    aria-label="Close image viewer"
                    onClick={() =>
                      setLightbox(
                        false
                      )
                    }
                    className="
                      ml-2
                      rounded-lg
                      border
                      border-white/30
                      p-2
                    "
                  >
                    <X
                      size={
                        21
                      }
                    />
                  </button>
                </div>
              </div>

              <div
                className="
                  relative
                  min-h-0
                  flex-1
                  overflow-hidden
                "
                onWheel={(
                  event
                ) => {
                  if (
                    event.ctrlKey
                  ) {
                    event.preventDefault();

                    setZoom(
                      (
                        current
                      ) =>
                        Math.max(
                          1,
                          Math.min(
                            4,
                            current +
                              (event.deltaY <
                              0
                                ? 0.25
                                : -0.25)
                          )
                        )
                    );
                  }
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    photos[
                      selected
                    ]
                  }
                  alt={`${title}, enlarged photo ${
                    selected +
                    1
                  }`}
                  onClick={() =>
                    setZoom(
                      (
                        current
                      ) =>
                        current >
                        1
                          ? 1
                          : 2
                    )
                  }
                  className={`
                    h-full
                    w-full
                    select-none
                    object-contain
                    transition-transform
                    duration-150

                    ${
                      zoom >
                      1
                        ? "cursor-zoom-out"
                        : "cursor-zoom-in"
                    }
                  `}
                  style={{
                    transform: `scale(${zoom})`,
                  }}
                  draggable={
                    false
                  }
                />

                {count >
                1 ? (
                  <>
                    <button
                      type="button"
                      aria-label="Previous enlarged photo"
                      onClick={() =>
                        select(
                          selected -
                            1
                        )
                      }
                      className="
                        absolute
                        left-2
                        top-1/2
                        -translate-y-1/2
                        rounded-full
                        bg-black/70
                        p-3
                      "
                    >
                      <ChevronLeft
                        size={
                          25
                        }
                      />
                    </button>

                    <button
                      type="button"
                      aria-label="Next enlarged photo"
                      onClick={() =>
                        select(
                          selected +
                            1
                        )
                      }
                      className="
                        absolute
                        right-2
                        top-1/2
                        -translate-y-1/2
                        rounded-full
                        bg-black/70
                        p-3
                      "
                    >
                      <ChevronRight
                        size={
                          25
                        }
                      />
                    </button>
                  </>
                ) : null}
              </div>

              {
                thumbnails(
                  true
                )
              }

              <p
                className="
                  shrink-0
                  pb-2
                  text-center
                  text-[11px]
                  text-white/60
                "
              >
                Tap/click image or use + / − to zoom, arrow
                keys to browse, Esc to close
              </p>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}