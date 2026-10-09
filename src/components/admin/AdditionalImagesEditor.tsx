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

          file.size ===

            0 ||

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

        if (

          index < 0 ||

          index >= current.length ||

          index + step < 0 ||

          index + step >= current.length

        ) {

          return current;

        }



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

    <section className="mt-6 w-full min-w-0 rounded-2xl border border-brand/15 bg-white p-4 md:p-5">

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



      {/* Submit only the accepted files in their current display order. */}

      <input

        ref={

          inputRef

        }

        name="galleryFiles"

        type="file"

        accept="image/jpeg,image/png,image/webp"

        multiple

        hidden

      />



      <label className="mt-4 flex min-h-14 w-full min-w-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-brand/30 bg-[#fff8f8] px-4 py-4 text-center text-sm font-semibold leading-6 text-brand transition-colors hover:border-brand/60 hover:bg-brand/[0.06] focus-within:outline-none focus-within:ring-2 focus-within:ring-brand/30 sm:flex-row">

        <ImagePlus className="h-5 w-5 shrink-0" />



        <span className="min-w-0 whitespace-normal break-words">

          Select multiple images

        </span>



        <input

          type="file"

          accept="image/jpeg,image/png,image/webp"

          multiple

          onChange={(

            event

          ) => {

            addFiles(

              event

                .target

                .files

            );



            event.target.value = "";

          }}

          className="sr-only"

        />

      </label>



      <div className="mt-3 flex min-w-0 flex-col gap-2 sm:flex-row sm:items-stretch">

        <input

          type="url"

          aria-label="Additional image URL"

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

          className="min-h-12 w-full min-w-0 rounded-lg border border-brand/15 px-3 py-3 text-sm leading-6 outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/10 sm:flex-1"

        />



        <button

          type="button"

          onClick={

            addUrl

          }

          className="inline-flex min-h-12 w-full shrink-0 items-center justify-center whitespace-nowrap rounded-lg bg-brand px-5 py-3 text-xs font-bold leading-6 text-white transition-colors hover:bg-brand-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2 sm:w-auto"

        >

          Add URL

        </button>

      </div>



      {error ? (

        <p

          role="alert"

          className="mt-2 break-words text-sm leading-6 text-red-600"

        >

          {

            error

          }

        </p>

      ) : null}



      {entries.length >

      0 ? (

        <div className="mt-4 grid min-w-0 grid-cols-1 gap-3 min-[520px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">

          {entries.map(

            (

              entry,

              index

            ) => (

              <div

                key={

                  entry.id

                }

                className="min-w-0 rounded-xl border border-brand/10 bg-white p-3"

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

                  className="h-32 w-full rounded-lg bg-slate-50 object-contain"

                />



                <p className="mt-1 truncate text-[11px] text-slate-500">

                  Photo{" "}

                  {

                    index +

                    2

                  }

                </p>



                <div className="mt-3 grid grid-cols-3 gap-2">

                  <button

                    type="button"

                    aria-label="Move photo earlier"

                    title="Move photo earlier"

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

                    className="inline-flex h-11 w-full min-w-0 items-center justify-center rounded-lg border border-brand/15 bg-[#fff8f8] text-brand transition-colors hover:border-brand/40 hover:bg-brand/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/25 disabled:cursor-not-allowed disabled:opacity-30"

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

                    title="Move photo later"

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

                    className="inline-flex h-11 w-full min-w-0 items-center justify-center rounded-lg border border-brand/15 bg-[#fff8f8] text-brand transition-colors hover:border-brand/40 hover:bg-brand/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/25 disabled:cursor-not-allowed disabled:opacity-30"

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

                    title="Remove photo"

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

                    className="inline-flex h-11 w-full min-w-0 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition-colors hover:border-red-300 hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"

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