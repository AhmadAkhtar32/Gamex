import type {
  ReactNode,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  Eye,
  EyeOff,
  Gamepad2,
  ImageIcon,
  Link2,
  Menu,
  Navigation,
  Plus,
  Save,
} from "lucide-react";

import {
  asc,
  eq,
} from "drizzle-orm";

import { db } from "@/db";

import {
  navbarLinks,
  navbarSettings,
} from "@/db/schema";

import {
  requireAdmin,
} from "@/lib/admin-auth";

import {
  createDefaultNavbarLinks,
  createNavbarLink,
  saveNavbarSettings,
  toggleNavbarLinkVisibility,
  updateNavbarLink,
} from "./actions";

import DeleteNavbarLinkButton from "./DeleteNavbarLinkButton";

/* =========================================================
   PAGE TYPES
   ========================================================= */

type NavbarAdminPageProps = {
  searchParams: Promise<{
    saved?: string;
    error?: string;

    linkCreated?: string;
    linkUpdated?: string;
    linkDeleted?: string;
    visibilityUpdated?: string;
    defaultsCreated?: string;
  }>;
};

/* =========================================================
   DEFAULT SETTINGS
   ========================================================= */

const DEFAULT_NAVBAR_SETTINGS = {
  id: "main",

  brandText:
    "GAMEX",

  brandHref:
    "#home",

  logoImage:
    "",

  logoAlt:
    "Gamex",

  ctaText:
    "Build Your Rig",

  ctaHref:
  "#contact",

  ctaVisible:
    true,

  isVisible:
    true,
};

/* =========================================================
   PAGE
   ========================================================= */

export default async function NavbarAdminPage({
  searchParams,
}: NavbarAdminPageProps) {
  await requireAdmin();

  const query =
    await searchParams;

  /* =======================================================
     LOAD NAVBAR SETTINGS
     ======================================================= */

  const settingsRows =
    await db
      .select()
      .from(
        navbarSettings
      )
      .where(
        eq(
          navbarSettings.id,
          "main"
        )
      )
      .limit(1);

  const settings =
    settingsRows[0] ??
    DEFAULT_NAVBAR_SETTINGS;

  /* =======================================================
     LOAD NAVIGATION LINKS
     ======================================================= */

  const links =
    await db
      .select()
      .from(
        navbarLinks
      )
      .orderBy(
        asc(
          navbarLinks.sortOrder
        ),
        asc(
          navbarLinks.id
        )
      );

  /* =======================================================
     PAGE
     ======================================================= */

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      {/* =====================================================
          TOP BAR
          ===================================================== */}

      <header
        className="
          border-b
          border-brand/10
          bg-white
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-7xl
            items-center
            justify-between
            gap-4
            px-5
            py-4
            md:px-8
          "
        >
          <div>
            <p
              className="
                font-display
                text-lg
                font-extrabold
                uppercase
                tracking-widest
                text-brand-deep
              "
            >
              Gamex Admin
            </p>

            <p
              className="
                mt-0.5
                text-xs
                text-slate-500
              "
            >
              Website Navigation
            </p>
          </div>

          <Link
            href="/admin"
            className="
              inline-flex
              items-center
              gap-2
              rounded-lg
              border
              border-brand/15
              bg-white
              px-4
              py-2.5
              text-xs
              font-bold
              uppercase
              tracking-wider
              text-brand
              transition-all
              hover:border-brand
              hover:bg-brand
              hover:text-white
            "
          >
            <ArrowLeft
              className="h-4 w-4"
            />

            Dashboard
          </Link>
        </div>
      </header>

      {/* =====================================================
          PAGE CONTENT
          ===================================================== */}

      <div
        className="
          mx-auto
          max-w-7xl
          px-5
          py-10
          md:px-8
          md:py-14
        "
      >
        {/* ===================================================
            TITLE
            =================================================== */}

        <div>
          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.24em]
              text-brand
            "
          >
            Homepage
          </p>

          <h1
            className="
              mt-2
              font-display
              text-3xl
              font-extrabold
              uppercase
              text-brand-deep
              md:text-4xl
            "
          >
            Navbar
          </h1>

          <p
            className="
              mt-3
              max-w-2xl
              text-sm
              leading-relaxed
              text-slate-500
            "
          >
            Manage the Gamex brand, optional logo,
            navigation links, CTA button and Navbar
            visibility.
          </p>
        </div>

        {/* ===================================================
            SUCCESS / ERROR MESSAGES
            =================================================== */}

        {query.saved === "1" ? (
          <SuccessMessage>
            Navbar settings saved successfully.
          </SuccessMessage>
        ) : null}

        {query.linkCreated === "1" ? (
          <SuccessMessage>
            Navigation link added successfully.
          </SuccessMessage>
        ) : null}

        {query.linkUpdated === "1" ? (
          <SuccessMessage>
            Navigation link updated successfully.
          </SuccessMessage>
        ) : null}

        {query.visibilityUpdated === "1" ? (
          <SuccessMessage>
            Navigation link visibility updated.
          </SuccessMessage>
        ) : null}

        {query.linkDeleted === "1" ? (
          <SuccessMessage>
            Navigation link deleted successfully.
          </SuccessMessage>
        ) : null}

        {query.defaultsCreated === "1" ? (
          <SuccessMessage>
            Original Gamex navigation links imported.
          </SuccessMessage>
        ) : null}

        {query.error ? (
          <div
            className="
              mt-7
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-5
              py-4
              text-sm
              font-semibold
              text-red-700
            "
          >
            {query.error}
          </div>
        ) : null}

        {/* ===================================================
            NAVBAR SETTINGS FORM
            =================================================== */}

        <form
          action={
            saveNavbarSettings
          }
          className="mt-8 space-y-8"
        >
          {/* =================================================
              GENERAL SETTINGS
              ================================================= */}

          <SectionCard
            eyebrow="Navbar Settings"
            title="Brand & Visibility"
          >
            <div
              className="
                grid
                gap-6
                md:grid-cols-2
              "
            >
              {/* =============================================
                  BRAND TEXT
                  ============================================= */}

              <Field label="Brand Text">
                <input
                  name="brandText"
                  type="text"
                  required
                  maxLength={120}
                  defaultValue={
                    settings.brandText
                  }
                  placeholder="GAMEX"
                  className={
                    inputClass
                  }
                />
              </Field>

              {/* =============================================
                  BRAND LINK
                  ============================================= */}

              <Field label="Brand Link">
                <div className="relative">
                  <Link2
                    className="
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
                    name="brandHref"
                    type="text"
                    required
                    maxLength={500}
                    defaultValue={
                      settings.brandHref
                    }
                    placeholder="#home"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </Field>
            </div>

            {/* ===============================================
                NAVBAR VISIBILITY
                =============================================== */}

            <div
              className="
                mt-7
                rounded-xl
                border
                border-brand/10
                bg-[#f7f9fc]
                p-5
              "
            >
              <label
                className="
                  flex
                  cursor-pointer
                  items-start
                  gap-3
                "
              >
                <input
                  name="isVisible"
                  type="checkbox"
                  defaultChecked={
                    settings.isVisible
                  }
                  className="
                    mt-1
                    h-4
                    w-4
                    accent-[#173160]
                  "
                />

                <span>
                  <span
                    className="
                      flex
                      items-center
                      gap-2
                      text-sm
                      font-bold
                      text-brand-deep
                    "
                  >
                    {settings.isVisible ? (
                      <Eye
                        className="h-4 w-4"
                      />
                    ) : (
                      <EyeOff
                        className="h-4 w-4"
                      />
                    )}

                    Show Navbar on website
                  </span>

                  <span
                    className="
                      mt-1
                      block
                      text-xs
                      text-slate-500
                    "
                  >
                    Hiding it does not remove any Navbar
                    settings or links.
                  </span>
                </span>
              </label>
            </div>
          </SectionCard>

          {/* =================================================
              LOGO SETTINGS
              ================================================= */}

          <SectionCard
            eyebrow="Brand Identity"
            title="Navbar Logo"
          >
            <div
              className="
                grid
                gap-8
                lg:grid-cols-[280px_1fr]
              "
            >
              {/* =============================================
                  CURRENT LOGO PREVIEW
                  ============================================= */}

              <div>
                <p className={labelClass}>
                  Current Logo
                </p>

                <div
                  className="
                    flex
                    min-h-48
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-2xl
                    border
                    border-brand/10
                    bg-[#f7f9fc]
                    p-6
                  "
                >
                  {settings.logoImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={
                        settings.logoImage
                      }
                      alt={
                        settings.logoAlt
                      }
                      className="
                        max-h-32
                        max-w-full
                        object-contain
                      "
                    />
                  ) : (
                    <div className="text-center">
                      <div
                        className="
                          mx-auto
                          grid
                          h-16
                          w-16
                          place-items-center
                          rounded-2xl
                          bg-brand
                          text-white
                        "
                      >
                        <Gamepad2
                          className="h-8 w-8"
                        />
                      </div>

                      <p
                        className="
                          mt-4
                          text-xs
                          font-bold
                          uppercase
                          tracking-wider
                          text-brand-deep
                        "
                      >
                        Default Gamepad Icon
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* =============================================
                  LOGO CONTROLS
                  ============================================= */}

              <div className="space-y-5">
                <input
                  type="hidden"
                  name="currentLogoImage"
                  value={
                    settings.logoImage
                  }
                />

                {/* LOGO ALT */}

                <Field label="Logo Alt Text">
                  <input
                    name="logoAlt"
                    type="text"
                    required
                    maxLength={255}
                    defaultValue={
                      settings.logoAlt
                    }
                    placeholder="Gamex"
                    className={
                      inputClass
                    }
                  />
                </Field>

                {/* FILE UPLOAD */}

                <Field label="Upload Logo">
                  <label
                    className="
                      flex
                      cursor-pointer
                      items-center
                      gap-3
                      rounded-xl
                      border
                      border-dashed
                      border-brand/25
                      bg-[#f7f9fc]
                      px-4
                      py-4
                      transition-colors
                      hover:border-brand/50
                      hover:bg-brand/[0.03]
                    "
                  >
                    <div
                      className="
                        grid
                        h-10
                        w-10
                        shrink-0
                        place-items-center
                        rounded-lg
                        bg-brand/[0.08]
                        text-brand
                      "
                    >
                      <ImageIcon
                        className="h-5 w-5"
                      />
                    </div>

                    <div>
                      <p
                        className="
                          text-sm
                          font-bold
                          text-brand-deep
                        "
                      >
                        Choose image
                      </p>

                      <p
                        className="
                          mt-0.5
                          text-xs
                          text-slate-400
                        "
                      >
                        JPG, PNG or WebP — max 5 MB
                      </p>
                    </div>

                    <input
                      name="logoFile"
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      className="sr-only"
                    />
                  </label>
                </Field>

                {/* OR */}

                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <div
                    className="
                      h-px
                      flex-1
                      bg-brand/10
                    "
                  />

                  <span
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-slate-400
                    "
                  >
                    Or
                  </span>

                  <div
                    className="
                      h-px
                      flex-1
                      bg-brand/10
                    "
                  />
                </div>

                {/* IMAGE URL */}

                <Field label="Logo Image URL">
                  <input
                    name="logoImageUrl"
                    type="url"
                    maxLength={1000}
                    placeholder="https://example.com/gamex-logo.png"
                    className={
                      inputClass
                    }
                  />
                </Field>

                {/* REMOVE LOGO */}

                {settings.logoImage ? (
                  <label
                    className="
                      flex
                      cursor-pointer
                      items-start
                      gap-3
                      rounded-xl
                      border
                      border-red-100
                      bg-red-50/50
                      p-4
                    "
                  >
                    <input
                      name="removeLogo"
                      type="checkbox"
                      className="
                        mt-1
                        h-4
                        w-4
                        accent-red-600
                      "
                    />

                    <span>
                      <span
                        className="
                          block
                          text-sm
                          font-bold
                          text-red-700
                        "
                      >
                        Remove current logo
                      </span>

                      <span
                        className="
                          mt-1
                          block
                          text-xs
                          text-red-500
                        "
                      >
                        The original Gamepad icon will be used
                        again.
                      </span>
                    </span>
                  </label>
                ) : null}
              </div>
            </div>
          </SectionCard>

          {/* =================================================
              CTA SETTINGS
              ================================================= */}

          <SectionCard
            eyebrow="Call To Action"
            title="Navbar CTA Button"
          >
            <div
              className="
                grid
                gap-6
                md:grid-cols-2
              "
            >
              {/* CTA TEXT */}

              <Field label="Button Text">
                <input
                  name="ctaText"
                  type="text"
                  required
                  maxLength={120}
                  defaultValue={
                    settings.ctaText
                  }
                  placeholder="Build Your Rig"
                  className={
                    inputClass
                  }
                />
              </Field>

              {/* CTA LINK */}

              <Field label="Button Link">
                <div className="relative">
                  <Link2
                    className="
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
                    name="ctaHref"
                    type="text"
                    required
                    maxLength={500}
                    defaultValue={
                      settings.ctaHref
                    }
                    placeholder="#builds"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </Field>
            </div>

            {/* CTA VISIBILITY */}

            <div
              className="
                mt-6
                rounded-xl
                border
                border-brand/10
                bg-[#f7f9fc]
                p-4
              "
            >
              <label
                className="
                  flex
                  cursor-pointer
                  items-center
                  gap-3
                "
              >
                <input
                  name="ctaVisible"
                  type="checkbox"
                  defaultChecked={
                    settings.ctaVisible
                  }
                  className="
                    h-4
                    w-4
                    accent-[#173160]
                  "
                />

                <span
                  className="
                    text-sm
                    font-bold
                    text-brand-deep
                  "
                >
                  Show CTA button
                </span>
              </label>
            </div>
          </SectionCard>

          {/* =================================================
              SAVE NAVBAR SETTINGS
              ================================================= */}

          <div
            className="
              flex
              justify-end
              rounded-2xl
              border
              border-brand/10
              bg-white
              p-4
              shadow-[0_15px_45px_-25px_rgba(23,49,96,0.45)]
            "
          >
            <button
              type="submit"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-brand
                px-7
                py-3.5
                font-display
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-white
                transition-all
                hover:-translate-y-0.5
                hover:bg-brand-soft
              "
            >
              <Save
                className="h-4 w-4"
              />

              Save Navbar Settings
            </button>
          </div>
        </form>

        {/* ===================================================
            NAVIGATION LINKS
            =================================================== */}

        <section
          id="navbar-links"
          className="
            mt-8
            rounded-2xl
            border
            border-brand/10
            bg-white
            p-6
            shadow-[0_25px_65px_-45px_rgba(23,49,96,0.35)]
            md:p-8
          "
        >
          {/* =================================================
              LINKS HEADING
              ================================================= */}

          <div
            className="
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-start
              sm:justify-between
            "
          >
            <div>
              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-brand
                "
              >
                Navigation
              </p>

              <h2
                className="
                  mt-2
                  font-display
                  text-2xl
                  font-extrabold
                  uppercase
                  text-brand-deep
                "
              >
                Navbar Links
              </h2>

              <p
                className="
                  mt-2
                  max-w-xl
                  text-sm
                  leading-relaxed
                  text-slate-500
                "
              >
                Add new menu items or edit the existing links.
                Display order controls their position from
                left to right.
              </p>
            </div>

            <div
              className="
                grid
                h-12
                w-12
                place-items-center
                rounded-xl
                bg-brand/[0.08]
                text-brand
              "
            >
              <Menu
                className="h-5 w-5"
              />
            </div>
          </div>

          {/* =================================================
              ADD NEW NAVIGATION LINK
              ================================================= */}

          <div
            className="
              mt-7
              rounded-2xl
              border
              border-brand/10
              bg-[#f7f9fc]
              p-5
              md:p-6
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  grid
                  h-10
                  w-10
                  place-items-center
                  rounded-xl
                  bg-brand
                  text-white
                "
              >
                <Plus
                  className="h-4 w-4"
                />
              </div>

              <div>
                <h3
                  className="
                    font-display
                    text-sm
                    font-extrabold
                    uppercase
                    text-brand-deep
                  "
                >
                  Add Navigation Link
                </h3>

                <p
                  className="
                    mt-1
                    text-xs
                    text-slate-500
                  "
                >
                  Example: Reviews → #reviews
                </p>
              </div>
            </div>

            <form
              action={
                createNavbarLink
              }
              className="mt-5"
            >
              <div
                className="
                  grid
                  gap-5
                  lg:grid-cols-[1fr_1.4fr_140px]
                "
              >
                {/* LABEL */}

                <Field label="Label">
                  <input
                    name="label"
                    required
                    maxLength={120}
                    placeholder="Reviews"
                    className={
                      inputClass
                    }
                  />
                </Field>

                {/* LINK */}

                <Field label="Link">
                  <input
                    name="href"
                    required
                    maxLength={500}
                    placeholder="#reviews"
                    className={
                      inputClass
                    }
                  />
                </Field>

                {/* ORDER */}

                <Field label="Order">
                  <input
                    name="sortOrder"
                    type="number"
                    min="0"
                    step="1"
                    defaultValue={
                      links.length
                    }
                    className={
                      inputClass
                    }
                  />
                </Field>
              </div>

              <div
                className="
                  mt-5
                  flex
                  flex-col
                  gap-4
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                {/* VISIBILITY */}

                <label
                  className="
                    flex
                    cursor-pointer
                    items-center
                    gap-3
                  "
                >
                  <input
                    name="isVisible"
                    type="checkbox"
                    defaultChecked
                    className="
                      h-4
                      w-4
                      accent-[#173160]
                    "
                  />

                  <span
                    className="
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-slate-600
                    "
                  >
                    Visible on website
                  </span>
                </label>

                {/* ADD */}

                <button
                  type="submit"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-brand
                    px-5
                    py-3
                    font-display
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-white
                    transition-all
                    hover:bg-brand-soft
                  "
                >
                  <Plus
                    className="h-4 w-4"
                  />

                  Add Link
                </button>
              </div>
            </form>
          </div>

          {/* =================================================
              EMPTY NAVBAR LINKS
              ================================================= */}

          {links.length === 0 ? (
            <div
              className="
                mt-7
                rounded-2xl
                border
                border-dashed
                border-brand/20
                bg-[#f7f9fc]
                px-6
                py-12
                text-center
              "
            >
              <div
                className="
                  mx-auto
                  grid
                  h-12
                  w-12
                  place-items-center
                  rounded-xl
                  bg-brand/[0.08]
                  text-brand
                "
              >
                <Navigation
                  className="h-5 w-5"
                />
              </div>

              <p
                className="
                  mt-4
                  font-display
                  text-sm
                  font-bold
                  uppercase
                  text-brand-deep
                "
              >
                No Navigation Links
              </p>

              <p
                className="
                  mx-auto
                  mt-2
                  max-w-md
                  text-sm
                  text-slate-500
                "
              >
                You can add links manually, or restore the
                original Gamex Navbar links.
              </p>

              <form
                action={
                  createDefaultNavbarLinks
                }
                className="mt-5"
              >
                <button
                  type="submit"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-brand/20
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
                    hover:bg-brand
                    hover:text-white
                  "
                >
                  <Navigation
                    className="h-4 w-4"
                  />

                  Import Original Links
                </button>
              </form>
            </div>
          ) : (
            /* ===============================================
               EXISTING NAVIGATION LINKS
               =============================================== */

            <div
              className="
                mt-7
                grid
                gap-4
              "
            >
              {links.map(
                (navLink) => (
                  <div
                    key={
                      navLink.id
                    }
                    className="
                      overflow-hidden
                      rounded-2xl
                      border
                      border-brand/10
                      bg-white
                    "
                  >
                    {/* =======================================
                        LINK HEADER
                        ======================================= */}

                    <div
                      className="
                        flex
                        flex-col
                        gap-3
                        border-b
                        border-brand/10
                        bg-[#f7f9fc]
                        px-5
                        py-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                      "
                    >
                      {/* LINK DETAILS */}

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >
                        <div
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
                          <Link2
                            className="h-4 w-4"
                          />
                        </div>

                        <div>
                          <div
                            className="
                              flex
                              flex-wrap
                              items-center
                              gap-2
                            "
                          >
                            <p
                              className="
                                font-display
                                text-sm
                                font-extrabold
                                uppercase
                                text-brand-deep
                              "
                            >
                              {
                                navLink.label
                              }
                            </p>

                            {/* VISIBLE / HIDDEN BADGE */}

                            <span
                              className={`
                                rounded-full
                                px-2.5
                                py-1
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-wider

                                ${
                                  navLink.isVisible
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-slate-100 text-slate-500"
                                }
                              `}
                            >
                              {navLink.isVisible
                                ? "Visible"
                                : "Hidden"}
                            </span>

                            {/* ORDER BADGE */}

                            <span
                              className="
                                rounded-full
                                bg-brand/[0.07]
                                px-2.5
                                py-1
                                text-[10px]
                                font-bold
                                text-brand
                              "
                            >
                              Order{" "}
                              {
                                navLink.sortOrder
                              }
                            </span>
                          </div>

                          <p
                            className="
                              mt-1
                              text-xs
                              text-slate-400
                            "
                          >
                            {
                              navLink.href
                            }
                          </p>
                        </div>
                      </div>

                      {/* =====================================
                          QUICK SHOW / HIDE
                          ===================================== */}

                      <form
                        action={
                          toggleNavbarLinkVisibility
                        }
                      >
                        <input
                          type="hidden"
                          name="linkId"
                          value={
                            navLink.id
                          }
                        />

                        <button
                          type="submit"
                          className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-lg
                            border
                            border-brand/15
                            bg-white
                            px-3
                            py-2
                            text-xs
                            font-bold
                            text-brand
                            transition-all
                            hover:border-brand
                            hover:bg-brand
                            hover:text-white
                          "
                        >
                          {navLink.isVisible ? (
                            <>
                              <EyeOff
                                className="h-4 w-4"
                              />

                              Hide
                            </>
                          ) : (
                            <>
                              <Eye
                                className="h-4 w-4"
                              />

                              Show
                            </>
                          )}
                        </button>
                      </form>
                    </div>

                    {/* =======================================
                        EDIT NAVIGATION LINK
                        ======================================= */}

                    <form
                      action={
                        updateNavbarLink
                      }
                      className="p-5 md:p-6"
                    >
                      <input
                        type="hidden"
                        name="linkId"
                        value={
                          navLink.id
                        }
                      />

                      <div
                        className="
                          grid
                          gap-5
                          lg:grid-cols-[1fr_1.4fr_140px]
                        "
                      >
                        {/* LABEL */}

                        <Field label="Label">
                          <input
                            name="label"
                            required
                            maxLength={
                              120
                            }
                            defaultValue={
                              navLink.label
                            }
                            className={
                              inputClass
                            }
                          />
                        </Field>

                        {/* LINK */}

                        <Field label="Link">
                          <input
                            name="href"
                            required
                            maxLength={
                              500
                            }
                            defaultValue={
                              navLink.href
                            }
                            className={
                              inputClass
                            }
                          />
                        </Field>

                        {/* ORDER */}

                        <Field label="Order">
                          <input
                            name="sortOrder"
                            type="number"
                            min="0"
                            step="1"
                            defaultValue={
                              navLink.sortOrder
                            }
                            className={
                              inputClass
                            }
                          />
                        </Field>
                      </div>

                      {/* =====================================
                          BOTTOM ACTION AREA
                          ===================================== */}

                      <div
                        className="
                          mt-5
                          flex
                          flex-col
                          gap-4
                          border-t
                          border-brand/10
                          pt-5
                          sm:flex-row
                          sm:items-center
                          sm:justify-between
                        "
                      >
                        {/* VISIBILITY */}

                        <label
                          className="
                            flex
                            cursor-pointer
                            items-center
                            gap-3
                          "
                        >
                          <input
                            name="isVisible"
                            type="checkbox"
                            defaultChecked={
                              navLink.isVisible
                            }
                            className="
                              h-4
                              w-4
                              accent-[#173160]
                            "
                          />

                          <span
                            className="
                              text-xs
                              font-bold
                              uppercase
                              tracking-wider
                              text-slate-600
                            "
                          >
                            Visible on website
                          </span>
                        </label>

                        {/* ===================================
                            SAVE + DELETE
                            =================================== */}

                        <div
                          className="
                            flex
                            flex-col
                            gap-2
                            sm:flex-row
                          "
                        >
                          <button
                            type="submit"
                            className="
                              inline-flex
                              items-center
                              justify-center
                              gap-2
                              rounded-lg
                              bg-brand
                              px-4
                              py-2.5
                              text-xs
                              font-bold
                              text-white
                              transition-all
                              hover:bg-brand-soft
                            "
                          >
                            <Save
                              className="h-4 w-4"
                            />

                            Save Changes
                          </button>

                          <DeleteNavbarLinkButton
                            id={
                              navLink.id
                            }
                            label={
                              navLink.label
                            }
                            href={
                              navLink.href
                            }
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                )
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/* =========================================================
   SUCCESS MESSAGE
   ========================================================= */

function SuccessMessage({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className="
        mt-7
        rounded-xl
        border
        border-emerald-200
        bg-emerald-50
        px-5
        py-4
        text-sm
        font-semibold
        text-emerald-700
      "
    >
      {children}
    </div>
  );
}

/* =========================================================
   SECTION CARD
   ========================================================= */

function SectionCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      className="
        rounded-2xl
        border
        border-brand/10
        bg-white
        p-6
        shadow-[0_25px_65px_-45px_rgba(23,49,96,0.35)]
        md:p-8
      "
    >
      <div
        className="
          border-b
          border-brand/10
          pb-5
        "
      >
        <p
          className="
            text-xs
            font-bold
            uppercase
            tracking-[0.18em]
            text-brand
          "
        >
          {eyebrow}
        </p>

        <h2
          className="
            mt-2
            font-display
            text-2xl
            font-extrabold
            uppercase
            text-brand-deep
          "
        >
          {title}
        </h2>
      </div>

      <div className="mt-7">
        {children}
      </div>
    </section>
  );
}

/* =========================================================
   FIELD
   ========================================================= */

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        className={
          labelClass
        }
      >
        {label}
      </label>

      {children}
    </div>
  );
}

/* =========================================================
   STYLES
   ========================================================= */

const labelClass = `
  mb-2
  block
  text-xs
  font-bold
  uppercase
  tracking-wider
  text-slate-600
`;

const inputClass = `
  w-full
  rounded-xl
  border
  border-brand/15
  bg-[#f7f9fc]
  px-4
  py-3.5
  text-sm
  text-brand-deep
  outline-none
  transition-all
  placeholder:text-slate-400
  hover:border-brand/25
  focus:border-brand/60
  focus:bg-white
  focus:shadow-[0_0_0_3px_rgba(23,49,96,0.10)]
`;