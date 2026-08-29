"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  FileText,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";

import {
  deleteBlogPost,
} from "./actions";

/* =========================================================
   TYPES
   ========================================================= */

type DeleteBlogPostButtonProps = {
  postId: number;
  title: string;
  slug: string;
};

/* =========================================================
   COMPONENT
   ========================================================= */

export default function DeleteBlogPostButton({
  postId,
  title,
  slug,
}: DeleteBlogPostButtonProps) {
  const [
    open,
    setOpen,
  ] = useState(false);

  /* =======================================================
     ESCAPE KEY
     ======================================================= */

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        setOpen(false);
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open]);

  return (
    <>
      {/* =====================================================
          DELETE BUTTON
          ===================================================== */}

      <button
        type="button"
        onClick={() =>
          setOpen(true)
        }
        className="
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-red-200
          bg-white
          px-5
          py-3
          text-xs
          font-bold
          uppercase
          tracking-wider
          text-red-600
          transition-all
          hover:border-red-600
          hover:bg-red-600
          hover:text-white
        "
      >
        <Trash2 className="h-4 w-4" />

        Delete Post
      </button>

      {/* =====================================================
          MODAL
          ===================================================== */}

      {open ? (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-slate-950/45
            px-5
            backdrop-blur-sm
          "
          onClick={() =>
            setOpen(false)
          }
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`delete-blog-post-${postId}`}
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
            className="
              w-full
              max-w-lg
              overflow-hidden
              rounded-2xl
              border
              border-red-100
              bg-white
              shadow-2xl
            "
          >
            {/* =================================================
                MODAL HEADER
                ================================================= */}

            <div
              className="
                flex
                items-start
                justify-between
                gap-4
                border-b
                border-red-100
                bg-red-50/70
                p-5
              "
            >
              <div
                className="
                  flex
                  items-start
                  gap-4
                "
              >
                <div
                  className="
                    grid
                    h-11
                    w-11
                    shrink-0
                    place-items-center
                    rounded-xl
                    bg-red-100
                    text-red-600
                  "
                >
                  <TriangleAlert className="h-5 w-5" />
                </div>

                <div>
                  <p
                    className="
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-red-500
                    "
                  >
                    Permanent Action
                  </p>

                  <h2
                    id={`delete-blog-post-${postId}`}
                    className="
                      mt-1
                      font-display
                      text-xl
                      font-extrabold
                      uppercase
                      text-brand-deep
                    "
                  >
                    Delete Blog Post?
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                aria-label="Close delete confirmation"
                className="
                  grid
                  h-9
                  w-9
                  shrink-0
                  place-items-center
                  rounded-lg
                  text-slate-400
                  transition-colors
                  hover:bg-white
                  hover:text-brand-deep
                "
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* =================================================
                BODY
                ================================================= */}

            <div className="p-5">
              <p
                className="
                  text-sm
                  leading-relaxed
                  text-slate-600
                "
              >
                Are you sure you want to permanently delete
                this Blog post?
              </p>

              {/* POST PREVIEW */}

              <div
                className="
                  mt-5
                  flex
                  items-start
                  gap-4
                  rounded-xl
                  border
                  border-brand/10
                  bg-[#f7f9fc]
                  p-4
                "
              >
                <div
                  className="
                    grid
                    h-11
                    w-11
                    shrink-0
                    place-items-center
                    rounded-xl
                    bg-white
                    text-brand
                    shadow-sm
                  "
                >
                  <FileText className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p
                    className="
                      font-display
                      text-sm
                      font-bold
                      text-brand-deep
                    "
                  >
                    {title}
                  </p>

                  <p
                    className="
                      mt-1
                      truncate
                      text-xs
                      text-slate-400
                    "
                  >
                    /blog/{slug}
                  </p>
                </div>
              </div>

              {/* WARNING */}

              <div
                className="
                  mt-5
                  rounded-xl
                  border
                  border-red-100
                  bg-red-50
                  p-4
                "
              >
                <p
                  className="
                    text-xs
                    leading-relaxed
                    text-red-600
                  "
                >
                  This removes the article permanently from
                  Neon. If you only want to remove it from the
                  public website temporarily, use{" "}
                  <strong>Hide Post</strong> instead.
                </p>
              </div>

              {/* =================================================
                  ACTIONS
                  ================================================= */}

              <div
                className="
                  mt-6
                  flex
                  flex-col-reverse
                  gap-3
                  sm:flex-row
                  sm:justify-end
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpen(false)
                  }
                  className="
                    rounded-xl
                    border
                    border-brand/15
                    bg-white
                    px-5
                    py-3
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-brand
                    transition-all
                    hover:border-brand
                    hover:bg-brand/[0.04]
                  "
                >
                  Cancel
                </button>

                <form
                  action={
                    deleteBlogPost
                  }
                >
                  <input
                    type="hidden"
                    name="postId"
                    value={postId}
                  />

                  <button
                    type="submit"
                    className="
                      inline-flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-red-600
                      px-5
                      py-3
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-white
                      transition-all
                      hover:bg-red-700
                    "
                  >
                    <Trash2 className="h-4 w-4" />

                    Delete Permanently
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}