"use client";

import { useRef, useState } from "react";

function normalizeSpecifications(value: string): string {
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/\u00a0/g, " ")
    .split("\n")
    .map((line) => line.replace(/[^\S\n]+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}

type SpecificationsTextareaProps = {
  id: string;
  name: string;
  required?: boolean;
  rows?: number;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
};

export function SpecificationsTextarea({
  id,
  name,
  required = false,
  rows = 7,
  placeholder,
  className,
  defaultValue = "",
}: SpecificationsTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [value, setValue] = useState(() =>
    normalizeSpecifications(defaultValue)
  );

  return (
    <textarea
      ref={textareaRef}
      id={id}
      name={name}
      required={required}
      rows={rows}
      placeholder={placeholder}
      className={className}
      value={value}
      style={{
        lineHeight: "1.5",
        letterSpacing: "normal",
        wordSpacing: "normal",
        textTransform: "none",
      }}
      onChange={(event) => setValue(event.currentTarget.value)}
      onBlur={() => setValue((current) => normalizeSpecifications(current))}
      onPaste={(event) => {
        const pasted = event.clipboardData.getData("text/plain");

        if (!pasted) return;

        event.preventDefault();

        const textarea = event.currentTarget;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const prefix = textarea.value.slice(0, start);
        const suffix = textarea.value.slice(end);

        const nextValue = normalizeSpecifications(
          prefix + pasted + suffix
        );

        const nextCaret = Math.min(
          normalizeSpecifications(prefix + pasted).length,
          nextValue.length
        );

        setValue(nextValue);

        requestAnimationFrame(() => {
          const current = textareaRef.current;

          if (current && document.activeElement === current) {
            current.setSelectionRange(nextCaret, nextCaret);
          }
        });
      }}
    />
  );
}