"use client";

import { useActionState } from "react";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { loginAdmin } from "./actions";

const initialState = {
  error: "",
};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(
    loginAdmin,
    initialState
  );

  return (
    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-white
        px-5
        py-16
      "
    >
      {/* Background grid */}
      <div
        className="
          bg-grid
          grid-animated
          pointer-events-none
          absolute
          inset-0
          opacity-35
        "
      />

      {/* Ambient glow */}
      <div
        className="
          pointer-events-none
          absolute
          -left-40
          -top-40
          h-[32rem]
          w-[32rem]
          rounded-full
          bg-brand/[0.07]
          blur-[140px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-40
          -right-40
          h-[32rem]
          w-[32rem]
          rounded-full
          bg-brand-soft/[0.06]
          blur-[140px]
        "
      />

      <div
        className="
          relative
          z-10
          w-full
          max-w-md
        "
      >
        <div
          className="
            rounded-3xl
            border
            border-brand/12
            bg-white/95
            p-7
            shadow-[0_30px_90px_-45px_rgba(23,49,96,0.45)]
            backdrop-blur-xl
            sm:p-9
          "
        >
          {/* Header */}
          <div className="text-center">
            <div
              className="
                mx-auto
                grid
                h-14
                w-14
                place-items-center
                rounded-2xl
                bg-brand
                text-white
                shadow-[0_14px_34px_-18px_rgba(23,49,96,0.7)]
              "
            >
              <ShieldCheck className="h-7 w-7" />
            </div>

            <p
              className="
                mt-5
                text-xs
                font-bold
                uppercase
                tracking-[0.28em]
                text-brand
              "
            >
              Secure Admin Access
            </p>

            <h1
              className="
                mt-2
                font-display
                text-3xl
                font-extrabold
                uppercase
                tracking-tight
                text-brand-deep
              "
            >
              Gamex Admin
            </h1>

            <p
              className="
                mt-3
                text-sm
                leading-relaxed
                text-slate-500
              "
            >
              Sign in to manage the Gamex website.
            </p>
          </div>

          {/* Login form */}
          <form
            action={formAction}
            className="mt-8"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="
                  mb-2
                  block
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-600
                "
              >
                Email
              </label>

              <div className="relative">
                <Mail
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
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@gamex.gg"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-brand/15
                    bg-[#f7f9fc]
                    py-3.5
                    pl-11
                    pr-4
                    text-sm
                    text-brand-deep
                    outline-none
                    transition-all
                    duration-300
                    placeholder:text-slate-400
                    hover:border-brand/25
                    focus:border-brand/60
                    focus:bg-white
                    focus:shadow-[0_0_0_3px_rgba(23,49,96,0.10)]
                  "
                />
              </div>
            </div>

            {/* Password */}
            <div className="mt-5">
              <label
                htmlFor="password"
                className="
                  mb-2
                  block
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-600
                "
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
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
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-brand/15
                    bg-[#f7f9fc]
                    py-3.5
                    pl-11
                    pr-4
                    text-sm
                    text-brand-deep
                    outline-none
                    transition-all
                    duration-300
                    placeholder:text-slate-400
                    hover:border-brand/25
                    focus:border-brand/60
                    focus:bg-white
                    focus:shadow-[0_0_0_3px_rgba(23,49,96,0.10)]
                  "
                />
              </div>
            </div>

            {/* Error */}
            {state.error ? (
              <div
                className="
                  mt-5
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-red-700
                "
              >
                {state.error}
              </div>
            ) : null}

            {/* Submit */}
            <button
              type="submit"
              disabled={pending}
              className="
                mt-6
                inline-flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-brand
                px-6
                py-4
                font-display
                text-sm
                font-bold
                uppercase
                tracking-widest
                text-white
                shadow-[0_16px_36px_-18px_rgba(23,49,96,0.7)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-brand-soft
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <ShieldCheck className="h-4 w-4" />

              {pending
                ? "Signing In..."
                : "Sign In"}
            </button>
          </form>

          <div
            className="
              mt-6
              border-t
              border-brand/10
              pt-5
              text-center
            "
          >
            <p className="text-xs text-slate-400">
              Authorized Gamex administrators only.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}