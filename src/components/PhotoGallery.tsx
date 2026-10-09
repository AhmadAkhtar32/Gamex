"use client";



import type { PointerEvent as ReactPointerEvent } from "react";



import {

  useCallback,

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



  const [pan, setPan] = useState({ x: 0, y: 0 });

  const viewerRef = useRef<HTMLDivElement>(null);

  const dialogRef = useRef<HTMLDivElement>(null);

  const galleryRef = useRef<HTMLDivElement>(null);

  const suppressClick = useRef(false);

  const gesture = useRef<{

    id: number;

    x: number;

    y: number;

    panX: number;

    panY: number;

  } | null>(null);



  const photos = Array.from(

    new Set(

      images

        .filter((src) => typeof src === "string")

        .map((src) => src.trim())

        .filter(Boolean)

    )

  );



  const count =

    photos.length;



  const activeIndex = Math.min(selected, Math.max(0, count - 1));



  const clampPan = useCallback((x: number, y: number, scale: number) => {

    const viewport = viewerRef.current;

    const maxX = viewport ? viewport.clientWidth * (scale - 1) / 2 : 0;

    const maxY = viewport ? viewport.clientHeight * (scale - 1) / 2 : 0;

    return {

      x: Math.max(-maxX, Math.min(maxX, x)),

      y: Math.max(-maxY, Math.min(maxY, y)),

    };

  }, []);



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

        (index % count) +

        count

      ) %

        count

    );



    setZoom(

      1

    );

    setPan({ x: 0, y: 0 });

  };



  const startGesture = (event: ReactPointerEvent<HTMLElement>) => {

    if (!event.isPrimary || event.button !== 0) return;

    suppressClick.current = false;

    gesture.current = {

      id: event.pointerId,

      x: event.clientX,

      y: event.clientY,

      panX: pan.x,

      panY: pan.y,

    };

    event.currentTarget.setPointerCapture(event.pointerId);

  };



  const moveGesture = (event: ReactPointerEvent<HTMLElement>) => {

    const start = gesture.current;

    if (!start || start.id !== event.pointerId) return;

    const dx = event.clientX - start.x;

    const dy = event.clientY - start.y;

    if (Math.hypot(dx, dy) > 8) suppressClick.current = true;

    if (lightbox && zoom > 1) {

      setPan(clampPan(start.panX + dx, start.panY + dy, zoom));

    }

  };



  const endGesture = (event: ReactPointerEvent<HTMLElement>) => {

    const start = gesture.current;

    if (!start || start.id !== event.pointerId) return;

    const dx = event.clientX - start.x;

    const dy = event.clientY - start.y;

    if (Math.hypot(dx, dy) > 8) suppressClick.current = true;

    if ((!lightbox || zoom === 1) && Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) {

      select(activeIndex + (dx < 0 ? 1 : -1));

    }

    gesture.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {

      event.currentTarget.releasePointerCapture(event.pointerId);

    }

  };



  const cancelGesture = () => {

    gesture.current = null;

    suppressClick.current = true;

  };



  const openViewer = () => {

    if (suppressClick.current) {

      suppressClick.current = false;

      return;

    }

    setZoom(1);

    setPan({ x: 0, y: 0 });

    setLightbox(true);

  };



  const toggleZoom = () => {

    if (suppressClick.current) {

      suppressClick.current = false;

      return;

    }

    setZoom((current) => current > 1 ? 1 : 2);

  };



  useEffect(() => {

    const resetBounds = () => {

      setPan((current) => clampPan(current.x, current.y, zoom));

    };

    resetBounds();

    window.addEventListener("resize", resetBounds);

    return () => window.removeEventListener("resize", resetBounds);

  }, [zoom, lightbox, clampPan]);



  useEffect(() => {

    for (const root of [galleryRef.current, dialogRef.current]) {

      const strip = root?.querySelector<HTMLElement>("[data-gallery-thumbnails]");

      const current = strip?.querySelector<HTMLElement>('[aria-current="true"]');

      if (!strip || !current) continue;

      const stripBox = strip.getBoundingClientRect();

      const currentBox = current.getBoundingClientRect();

      if (currentBox.left < stripBox.left) strip.scrollLeft -= stripBox.left - currentBox.left;

      if (currentBox.right > stripBox.right) strip.scrollLeft += currentBox.right - stripBox.right;

    }

  }, [activeIndex, lightbox]);



  useEffect(() => {

    const viewport = viewerRef.current;

    if (!lightbox || !viewport) return;

    const onWheel = (event: WheelEvent) => {

      if (!event.ctrlKey) return;

      event.preventDefault();

      event.stopPropagation();

      setZoom((current) => Math.max(1, Math.min(4, current + (event.deltaY < 0 ? 0.25 : -0.25))));

    };

    viewport.addEventListener("wheel", onWheel, { passive: false });

    return () => viewport.removeEventListener("wheel", onWheel);

  }, [lightbox]);



  useEffect(() => {

    if (

      !lightbox

    ) {

      return;

    }



    if (!count) {

      setLightbox(false);

      return;

    }



    const previouslyFocused = document.activeElement instanceof HTMLElement

      ? document.activeElement

      : null;



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

              Math.min(current, count - 1) +

              offset +

              count

            ) %

            count

        );



        setZoom(

          1

        );

        setPan({ x: 0, y: 0 });

      };



    const onKey =

      (

        event: KeyboardEvent

      ) => {

        if (event.key === "Tab") {

          const buttons = Array.from(

            dialogRef.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") ?? []

          );

          const first = buttons[0];

          const last = buttons[buttons.length - 1];

          const focused = document.activeElement;

          if (event.shiftKey && (focused === first || !dialogRef.current?.contains(focused))) {

            event.preventDefault();

            last?.focus();

          } else if (!event.shiftKey && (focused === last || !dialogRef.current?.contains(focused))) {

            event.preventDefault();

            first?.focus();

          }

          event.stopImmediatePropagation();

          return;

        }

        if (["Escape", "ArrowLeft", "ArrowRight", "+", "=", "-"].includes(event.key)) {

          event.preventDefault();

          event.stopImmediatePropagation();

        }



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



      previouslyFocused?.focus({ preventScroll: true });



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

          data-gallery-thumbnails

          aria-label={`${title} photo thumbnails`}

          className={`

            flex

            shrink-0

            gap-2

            min-w-0

            max-w-full

            overflow-x-auto

            overscroll-x-contain

            p-3



            ${

              large

                ? "bg-black/90"

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

                  activeIndex ===

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

                  first:ml-auto

                  last:mr-auto

                  focus-visible:outline

                  focus-visible:outline-2

                  focus-visible:outline-red-500

                  h-14

                  w-14

                  shrink-0

                  overflow-hidden

                  rounded-lg

                  border-2

                  transition-colors



                  ${

                    activeIndex ===

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

      ref={galleryRef}

      className="

        relative

        flex

        h-auto

        lg:h-full

        min-w-0

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

          min-h-[240px]

          sm:min-h-[320px]

          flex-1

        "

      >

        <button

          type="button"

          title="Open image and zoom"

          aria-label={`Enlarge ${title} photo ${

            activeIndex +

            1

          }`}

          onClick={openViewer}

          onPointerDown={startGesture}

          onPointerMove={moveGesture}

          onPointerUp={endGesture}

          onPointerCancel={cancelGesture}

          onLostPointerCapture={() => { gesture.current = null; }}

          style={{ touchAction: "pan-y pinch-zoom" }}

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

                activeIndex

              ]

            }

            alt={`${title} - photo ${

              activeIndex +

              1

            }`}

            className="

              h-full

              w-full

              object-contain

              p-3

              select-none

            "

            draggable={false}

          />

        </button>



        <button

          type="button"

          onClick={() => { suppressClick.current = false; openViewer(); }}

          aria-label="Zoom photo"

          className="

            absolute

            bottom-3

            right-3

            rounded-full

            border

            border-slate-200

            bg-white/95

            p-3

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

                  activeIndex -

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

                p-3

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

                  activeIndex +

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

                p-3

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

                activeIndex +

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

              ref={dialogRef}

              onClick={(event) => event.stopPropagation()}

              role="dialog"

              aria-modal="true"

              aria-label={`${title} photo viewer`}

              className="

                fixed

                inset-0

                h-dvh

                overflow-hidden

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

                  flex-wrap

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

                    activeIndex +

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

                    shrink-0

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

                      p-3

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

                      p-3

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

                      p-3

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

                ref={viewerRef}

              >

                {/* eslint-disable-next-line @next/next/no-img-element */}

                <img

                  src={

                    photos[

                      activeIndex

                    ]

                  }

                  alt={`${title}, enlarged photo ${

                    activeIndex +

                    1

                  }`}

                  onClick={toggleZoom}

                  onPointerDown={startGesture}

                  onPointerMove={moveGesture}

                  onPointerUp={endGesture}

                  onPointerCancel={cancelGesture}

                  onLostPointerCapture={() => { gesture.current = null; }}

                  className={`

                    h-full

                    w-full

                    select-none

                    object-contain

                    will-change-transform



                    ${

                      zoom >

                      1

                        ? "cursor-grab active:cursor-grabbing"

                        : "cursor-zoom-in"

                    }

                  `}

                  style={{

                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,

                    touchAction: "none",

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

                          activeIndex -

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

                          activeIndex +

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

                Tap/click or use + / − to zoom. Drag when zoomed.

                Swipe at 100% or use arrows to browse. Esc to close.

              </p>

            </div>,

            document.body

          )

        : null}

    </div>

  );

}