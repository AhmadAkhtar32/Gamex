"use client";

import {
  useRef,
} from "react";

import {
  Bold,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Pilcrow,
} from "lucide-react";

/* =========================================================
   TYPES
   ========================================================= */

type BlogContentEditorProps = {
  defaultValue?: string;
  placeholder?: string;
};

/* =========================================================
   BLOG CONTENT EDITOR
   ========================================================= */

export default function BlogContentEditor({
  defaultValue = "",
  placeholder =
    "Write the complete Blog article here...",
}: BlogContentEditorProps) {
  const textareaRef =
    useRef<HTMLTextAreaElement>(
      null
    );

  /* =======================================================
     REPLACE TEXT AND RESTORE CURSOR
     ======================================================= */

  function replaceSelection(
    replacement: string,
    selectionStart: number,
    selectionEnd: number
  ) {
    const textarea =
      textareaRef.current;

    if (!textarea) {
      return;
    }

    const current =
      textarea.value;

    textarea.value =
      current.slice(
        0,
        selectionStart
      ) +
      replacement +
      current.slice(
        selectionEnd
      );

    textarea.focus();

    requestAnimationFrame(
      () => {
        const cursor =
          selectionStart +
          replacement.length;

        textarea.setSelectionRange(
          cursor,
          cursor
        );
      }
    );

    /*
     * Trigger input event so React/browser forms remain aware
     * that the textarea changed.
     */

    textarea.dispatchEvent(
      new Event(
        "input",
        {
          bubbles: true,
        }
      )
    );
  }

  /* =======================================================
     WRAP SELECTED TEXT

     Example:
       gaming PC

     becomes:
       **gaming PC**
     ======================================================= */

  function wrapSelection(
    before: string,
    after: string,
    fallback: string
  ) {
    const textarea =
      textareaRef.current;

    if (!textarea) {
      return;
    }

    const start =
      textarea.selectionStart;

    const end =
      textarea.selectionEnd;

    const selected =
      textarea.value.slice(
        start,
        end
      );

    const content =
      selected ||
      fallback;

    const replacement =
      `${before}${content}${after}`;

    replaceSelection(
      replacement,
      start,
      end
    );

    /*
     * If no text was selected, select the placeholder so the
     * admin can immediately type over it.
     */

    if (!selected) {
      requestAnimationFrame(
        () => {
          textarea.setSelectionRange(
            start +
              before.length,

            start +
              before.length +
              fallback.length
          );
        }
      );
    }
  }

  /* =======================================================
     PREFIX CURRENT / SELECTED LINES

     Used for:
       ## heading
       - bullet
       1. numbered
     ======================================================= */

  function prefixLines(
    type:
      | "h2"
      | "h3"
      | "bullet"
      | "number"
  ) {
    const textarea =
      textareaRef.current;

    if (!textarea) {
      return;
    }

    const value =
      textarea.value;

    const selectionStart =
      textarea.selectionStart;

    const selectionEnd =
      textarea.selectionEnd;

    /*
     * Expand selection so whole lines are processed.
     */

    const lineStart =
      value.lastIndexOf(
        "\n",
        Math.max(
          0,
          selectionStart - 1
        )
      ) + 1;

    const nextNewLine =
      value.indexOf(
        "\n",
        selectionEnd
      );

    const lineEnd =
      nextNewLine === -1
        ? value.length
        : nextNewLine;

    const selectedLines =
      value.slice(
        lineStart,
        lineEnd
      );

    const lines =
      selectedLines
        .split("\n");

    const formatted =
      lines
        .map(
          (
            line,
            index
          ) => {
            /*
             * Remove existing simple formatting first.
             */

            const clean =
              line.replace(
                /^(#{1,3}\s+|-\s+|\d+\.\s+)/,
                ""
              );

            if (
              type ===
              "h2"
            ) {
              return `## ${clean}`;
            }

            if (
              type ===
              "h3"
            ) {
              return `### ${clean}`;
            }

            if (
              type ===
              "bullet"
            ) {
              return `- ${clean}`;
            }

            return `${index + 1}. ${clean}`;
          }
        )
        .join("\n");

    replaceSelection(
      formatted,
      lineStart,
      lineEnd
    );
  }

  /* =======================================================
     INSERT PARAGRAPH BREAK
     ======================================================= */

  function insertParagraph() {
    const textarea =
      textareaRef.current;

    if (!textarea) {
      return;
    }

    const start =
      textarea.selectionStart;

    const end =
      textarea.selectionEnd;

    replaceSelection(
      "\n\n",
      start,
      end
    );
  }

  return (
    <div>
      {/* =====================================================
          TOOLBAR
          ===================================================== */}

      <div
        className="
          flex
          flex-wrap
          gap-2
          rounded-t-xl
          border
          border-b-0
          border-brand/15
          bg-[#f7f9fc]
          p-3
        "
      >
        {/* H2 */}

        <ToolbarButton
          label="Heading"
          title="Heading"
          onClick={() =>
            prefixLines(
              "h2"
            )
          }
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>

        {/* H3 */}

        <ToolbarButton
          label="Subheading"
          title="Subheading"
          onClick={() =>
            prefixLines(
              "h3"
            )
          }
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        {/* BOLD */}

        <ToolbarButton
          label="Bold"
          title="Bold text"
          onClick={() =>
            wrapSelection(
              "**",
              "**",
              "bold text"
            )
          }
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>

        {/* BULLET LIST */}

        <ToolbarButton
          label="Bullets"
          title="Bullet list"
          onClick={() =>
            prefixLines(
              "bullet"
            )
          }
        >
          <List className="h-4 w-4" />
        </ToolbarButton>

        {/* NUMBERED LIST */}

        <ToolbarButton
          label="Numbers"
          title="Numbered list"
          onClick={() =>
            prefixLines(
              "number"
            )
          }
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        {/* PARAGRAPH */}

        <ToolbarButton
          label="Paragraph"
          title="Insert paragraph break"
          onClick={
            insertParagraph
          }
        >
          <Pilcrow className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* =====================================================
          TEXTAREA
          ===================================================== */}

      <textarea
        ref={
          textareaRef
        }
        name="content"
        rows={22}
        defaultValue={
          defaultValue
        }
        placeholder={
          placeholder
        }
        className="
          min-h-[480px]
          w-full
          resize-y
          rounded-b-xl
          border
          border-brand/15
          bg-white
          px-4
          py-4
          font-mono
          text-sm
          leading-7
          text-brand-deep
          outline-none
          transition-all
          placeholder:text-slate-400
          hover:border-brand/25
          focus:border-brand/60
          focus:shadow-[0_0_0_3px_rgba(23,49,96,0.10)]
        "
      />

      {/* =====================================================
          HELP
          ===================================================== */}

      <div
        className="
          mt-3
          rounded-xl
          border
          border-brand/10
          bg-[#f7f9fc]
          p-4
        "
      >
        <p
          className="
            text-xs
            font-bold
            uppercase
            tracking-wider
            text-brand
          "
        >
          Formatting
        </p>

        <p
          className="
            mt-2
            text-xs
            leading-relaxed
            text-slate-500
          "
        >
          Select text and use the toolbar. You can create
          headings, subheadings, bold text, bullet lists and
          numbered lists. Leave an empty line between
          paragraphs.
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   TOOLBAR BUTTON
   ========================================================= */

function ToolbarButton({
  children,
  label,
  title,
  onClick,
}: {
  children:
    React.ReactNode;

  label:
    string;

  title:
    string;

  onClick:
    () => void;
}) {
  return (
    <button
      type="button"
      title={
        title
      }
      onClick={
        onClick
      }
      className="
        inline-flex
        items-center
        gap-2
        rounded-lg
        border
        border-brand/10
        bg-white
        px-3
        py-2
        text-xs
        font-bold
        text-brand-deep
        transition-all
        hover:border-brand/30
        hover:bg-brand
        hover:text-white
      "
    >
      {children}

      <span
        className="
          hidden
          sm:inline
        "
      >
        {label}
      </span>
    </button>
  );
}