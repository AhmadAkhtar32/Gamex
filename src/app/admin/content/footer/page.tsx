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
  Navigation,
  Plus,
  Save,
  Share2,
} from "lucide-react";

import {
  asc,
  eq,
} from "drizzle-orm";

import { db } from "@/db";

import {
  footerLinks,
  footerSettings,
  footerSocialLinks,
} from "@/db/schema";

import {
  requireAdmin,
} from "@/lib/admin-auth";

import {
  createDefaultFooterLinks,
  createFooterLink,
  createFooterSocialLink,
  saveFooterSettings,
  toggleFooterLinkVisibility,
  toggleFooterSocialLinkVisibility,
  updateFooterLink,
  updateFooterSocialLink,
} from "./actions";

import DeleteFooterItemButton from "./DeleteFooterItemButton";

/* =========================================================
   TYPES
   ========================================================= */

type FooterAdminPageProps = {
  searchParams: Promise<{
    saved?: string;
    error?: string;

    linkCreated?: string;
    linkUpdated?: string;
    linkDeleted?: string;
    linkVisibilityUpdated?: string;
    defaultLinksCreated?: string;

    socialCreated?: string;
    socialUpdated?: string;
    socialDeleted?: string;
    socialVisibilityUpdated?: string;
  }>;
};

/* =========================================================
   DEFAULT FOOTER SETTINGS
   ========================================================= */

const DEFAULT_FOOTER_SETTINGS = {
  id: "main",

  brandText:
    "GAMEX",

  brandHref:
    "#home",

  logoImage:
    "",

  logoAlt:
    "Gamex",

  description:
    "High-performance gaming hardware, custom-built PCs and expert support for gamers who want more from their setup.",

  navigationHeading:
    "Navigate",

  contactHeading:
    "Get in touch",

  email:
    "hello@gamex.gg",

  phone:
    "0303-6009123",

  address:
    "17-A Airport Road Divine Garden Lahore",

  ctaText:
    "Start Your Build",

  ctaHref:
    "#contact",

  ctaVisible:
    true,

  copyrightText:
    "© {year} Gamex. All rights reserved. Play hard.",

  backToTopText:
    "Back to top",

  backToTopHref:
    "#home",

  isVisible:
    true,
};

/* =========================================================
   SOCIAL PLATFORMS
   ========================================================= */

const SOCIAL_PLATFORMS = [
  "instagram",
  "tiktok",
  "facebook",
  "youtube",
  "x",
  "twitch",
  "discord",
  "whatsapp",
  "linkedin",
];

/* =========================================================
   PAGE
   ========================================================= */

export default async function FooterAdminPage({
  searchParams,
}: FooterAdminPageProps) {
  await requireAdmin();

  const query =
    await searchParams;

  /* =======================================================
     LOAD SETTINGS
     ======================================================= */

  const settingsRows =
    await db
      .select()
      .from(
        footerSettings
      )
      .where(
        eq(
          footerSettings.id,
          "main"
        )
      )
      .limit(1);

  const settings =
    settingsRows[0] ??
    DEFAULT_FOOTER_SETTINGS;

  /* =======================================================
     LOAD FOOTER LINKS
     ======================================================= */

  const links =
    await db
      .select()
      .from(
        footerLinks
      )
      .orderBy(
        asc(
          footerLinks.sortOrder
        ),
        asc(
          footerLinks.id
        )
      );

  /* =======================================================
     LOAD SOCIAL LINKS
     ======================================================= */

  const socials =
    await db
      .select()
      .from(
        footerSocialLinks
      )
      .orderBy(
        asc(
          footerSocialLinks.sortOrder
        ),
        asc(
          footerSocialLinks.id
        )
      );

  /* =======================================================
     PAGE
     ======================================================= */

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      {/* =====================================================
          HEADER
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
              Footer Management
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
            <ArrowLeft className="h-4 w-4" />

            Dashboard
          </Link>
        </div>
      </header>

      {/* =====================================================
          CONTENT
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
            PAGE HEADING
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
            Website Content
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
            Footer
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
            Manage Footer branding, contact details,
            navigation, social links, CTA and copyright
            information.
          </p>
        </div>

        {/* ===================================================
            MESSAGES
            =================================================== */}

        {query.saved === "1" ? (
          <SuccessMessage>
            Footer settings saved successfully.
          </SuccessMessage>
        ) : null}

        {query.linkCreated === "1" ? (
          <SuccessMessage>
            Footer link added successfully.
          </SuccessMessage>
        ) : null}

        {query.linkUpdated === "1" ? (
          <SuccessMessage>
            Footer link updated successfully.
          </SuccessMessage>
        ) : null}

        {query.linkVisibilityUpdated === "1" ? (
          <SuccessMessage>
            Footer link visibility updated.
          </SuccessMessage>
        ) : null}

        {query.linkDeleted === "1" ? (
          <SuccessMessage>
            Footer link deleted successfully.
          </SuccessMessage>
        ) : null}

        {query.defaultLinksCreated === "1" ? (
          <SuccessMessage>
            Default Footer navigation imported.
          </SuccessMessage>
        ) : null}

        {query.socialCreated === "1" ? (
          <SuccessMessage>
            Social profile added successfully.
          </SuccessMessage>
        ) : null}

        {query.socialUpdated === "1" ? (
          <SuccessMessage>
            Social profile updated successfully.
          </SuccessMessage>
        ) : null}

        {query.socialVisibilityUpdated === "1" ? (
          <SuccessMessage>
            Social profile visibility updated.
          </SuccessMessage>
        ) : null}

        {query.socialDeleted === "1" ? (
          <SuccessMessage>
            Social profile deleted successfully.
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
            FOOTER SETTINGS
            =================================================== */}

        <form
          action={
            saveFooterSettings
          }
          className="mt-8 space-y-8"
        >
          {/* =================================================
              BRAND
              ================================================= */}

          <SectionCard
            eyebrow="Footer Settings"
            title="Brand & Visibility"
          >
            <div
              className="
                grid
                gap-6
                md:grid-cols-2
              "
            >
              <Field label="Brand Text">
                <input
                  name="brandText"
                  required
                  maxLength={120}
                  defaultValue={
                    settings.brandText
                  }
                  className={
                    inputClass
                  }
                />
              </Field>

              <Field label="Brand Link">
                <input
                  name="brandHref"
                  required
                  maxLength={500}
                  defaultValue={
                    settings.brandHref
                  }
                  className={
                    inputClass
                  }
                />
              </Field>
            </div>

            <div className="mt-6">
              <Field label="Footer Description">
                <textarea
                  name="description"
                  required
                  rows={4}
                  defaultValue={
                    settings.description
                  }
                  className={`${inputClass} resize-y`}
                />
              </Field>
            </div>

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
                  name="isVisible"
                  type="checkbox"
                  defaultChecked={
                    settings.isVisible
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
                  Show Footer on website
                </span>
              </label>
            </div>
          </SectionCard>

          {/* =================================================
              LOGO
              ================================================= */}

          <SectionCard
            eyebrow="Brand Identity"
            title="Footer Logo"
          >
            <div
              className="
                grid
                gap-8
                lg:grid-cols-[280px_1fr]
              "
            >
              {/* =============================================
                  PREVIEW
                  ============================================= */}

              <div>
                <p
                  className={
                    labelClass
                  }
                >
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
                  LOGO FIELDS
                  ============================================= */}

              <div className="space-y-5">
                <input
                  type="hidden"
                  name="currentLogoImage"
                  value={
                    settings.logoImage
                  }
                />

                <Field label="Logo Alt Text">
                  <input
                    name="logoAlt"
                    required
                    maxLength={255}
                    defaultValue={
                      settings.logoAlt
                    }
                    className={
                      inputClass
                    }
                  />
                </Field>

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
                      p-4
                      transition-colors
                      hover:border-brand/50
                    "
                  >
                    <ImageIcon
                      className="
                        h-5
                        w-5
                        text-brand
                      "
                    />

                    <span>
                      <span
                        className="
                          block
                          text-sm
                          font-bold
                          text-brand-deep
                        "
                      >
                        Choose image
                      </span>

                      <span
                        className="
                          block
                          text-xs
                          text-slate-400
                        "
                      >
                        JPG, PNG or WebP — max 5 MB
                      </span>
                    </span>

                    <input
                      name="logoFile"
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      className="sr-only"
                    />
                  </label>
                </Field>

                <Field label="Or use Logo URL">
                  <input
                    name="logoImageUrl"
                    type="url"
                    maxLength={1000}
                    placeholder="https://example.com/logo.png"
                    className={
                      inputClass
                    }
                  />
                </Field>

                {settings.logoImage ? (
                  <label
                    className="
                      flex
                      cursor-pointer
                      items-center
                      gap-3
                      rounded-xl
                      border
                      border-red-100
                      bg-red-50
                      p-4
                    "
                  >
                    <input
                      name="removeLogo"
                      type="checkbox"
                      className="
                        h-4
                        w-4
                        accent-red-600
                      "
                    />

                    <span
                      className="
                        text-sm
                        font-bold
                        text-red-700
                      "
                    >
                      Remove current custom logo
                    </span>
                  </label>
                ) : null}
              </div>
            </div>
          </SectionCard>

          {/* =================================================
              NAVIGATION / CONTACT
              ================================================= */}

          <SectionCard
            eyebrow="Footer Columns"
            title="Navigation & Contact"
          >
            <div
              className="
                grid
                gap-6
                md:grid-cols-2
              "
            >
              <Field label="Navigation Heading">
                <input
                  name="navigationHeading"
                  required
                  maxLength={120}
                  defaultValue={
                    settings.navigationHeading
                  }
                  className={
                    inputClass
                  }
                />
              </Field>

              <Field label="Contact Heading">
                <input
                  name="contactHeading"
                  required
                  maxLength={120}
                  defaultValue={
                    settings.contactHeading
                  }
                  className={
                    inputClass
                  }
                />
              </Field>

              <Field label="Email">
                <input
                  name="email"
                  type="email"
                  required
                  maxLength={255}
                  defaultValue={
                    settings.email
                  }
                  className={
                    inputClass
                  }
                />
              </Field>

              <Field label="Phone">
                <input
                  name="phone"
                  required
                  maxLength={120}
                  defaultValue={
                    settings.phone
                  }
                  className={
                    inputClass
                  }
                />
              </Field>
            </div>

            <div className="mt-6">
              <Field label="Address">
                <textarea
                  name="address"
                  required
                  rows={3}
                  defaultValue={
                    settings.address
                  }
                  className={`${inputClass} resize-y`}
                />
              </Field>
            </div>
          </SectionCard>

          {/* =================================================
              CTA
              ================================================= */}

          <SectionCard
            eyebrow="Call To Action"
            title="Footer CTA"
          >
            <div
              className="
                grid
                gap-6
                md:grid-cols-2
              "
            >
              <Field label="CTA Text">
                <input
                  name="ctaText"
                  required
                  maxLength={120}
                  defaultValue={
                    settings.ctaText
                  }
                  className={
                    inputClass
                  }
                />
              </Field>

              <Field label="CTA Link">
                <input
                  name="ctaHref"
                  required
                  maxLength={500}
                  defaultValue={
                    settings.ctaHref
                  }
                  className={
                    inputClass
                  }
                />
              </Field>
            </div>

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
                  Show Footer CTA
                </span>
              </label>
            </div>
          </SectionCard>

          {/* =================================================
              BOTTOM BAR
              ================================================= */}

          <SectionCard
            eyebrow="Bottom Bar"
            title="Copyright & Back To Top"
          >
            <Field label="Copyright Text">
              <input
                name="copyrightText"
                required
                maxLength={500}
                defaultValue={
                  settings.copyrightText
                }
                className={
                  inputClass
                }
              />

              <p
                className="
                  mt-2
                  text-xs
                  text-slate-400
                "
              >
                Use{" "}
                <code
                  className="
                    font-bold
                    text-brand
                  "
                >
                  {"{year}"}
                </code>{" "}
                to automatically display the current year.
              </p>
            </Field>

            <div
              className="
                mt-6
                grid
                gap-6
                md:grid-cols-2
              "
            >
              <Field label="Back To Top Text">
                <input
                  name="backToTopText"
                  required
                  maxLength={120}
                  defaultValue={
                    settings.backToTopText
                  }
                  className={
                    inputClass
                  }
                />
              </Field>

              <Field label="Back To Top Link">
                <input
                  name="backToTopHref"
                  required
                  maxLength={500}
                  defaultValue={
                    settings.backToTopHref
                  }
                  className={
                    inputClass
                  }
                />
              </Field>
            </div>
          </SectionCard>

          {/* =================================================
              SAVE SETTINGS
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
            "
          >
            <button
              type="submit"
              className="
                inline-flex
                items-center
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
                hover:bg-brand-soft
              "
            >
              <Save
                className="h-4 w-4"
              />

              Save Footer Settings
            </button>
          </div>
        </form>

        {/* ===================================================
            FOOTER LINKS
            =================================================== */}

        <section
          id="footer-links"
          className="
            mt-8
            rounded-2xl
            border
            border-brand/10
            bg-white
            p-6
            md:p-8
          "
        >
          <SectionHeading
            icon={
              <Navigation
                className="h-5 w-5"
              />
            }
            eyebrow="Navigation"
            title="Footer Links"
            description="Manage the links shown in the Footer navigation column."
          />

          {/* =================================================
              ADD LINK
              ================================================= */}

          <form
            action={
              createFooterLink
            }
            className="
              mt-7
              rounded-2xl
              border
              border-brand/10
              bg-[#f7f9fc]
              p-5
            "
          >
            <div
              className="
                grid
                gap-5
                lg:grid-cols-[1fr_1.4fr_130px]
              "
            >
              <Field label="Label">
                <input
                  name="label"
                  required
                  maxLength={120}
                  placeholder="Support"
                  className={
                    inputClass
                  }
                />
              </Field>

              <Field label="Link">
                <input
                  name="href"
                  required
                  maxLength={500}
                  placeholder="#contact"
                  className={
                    inputClass
                  }
                />
              </Field>

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
              <label
                className="
                  flex
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
                    text-slate-600
                  "
                >
                  Visible
                </span>
              </label>

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
                  text-xs
                  font-bold
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

          {/* =================================================
              EMPTY LINKS
              ================================================= */}

          {links.length === 0 ? (
            <div
              className="
                mt-6
                rounded-2xl
                border
                border-dashed
                border-brand/20
                bg-[#f7f9fc]
                p-10
                text-center
              "
            >
              <p
                className="
                  font-bold
                  text-brand-deep
                "
              >
                No Footer links yet.
              </p>

              <form
                action={
                  createDefaultFooterLinks
                }
                className="mt-5"
              >
                <button
                  type="submit"
                  className="
                    rounded-xl
                    border
                    border-brand/20
                    bg-white
                    px-5
                    py-3
                    text-xs
                    font-bold
                    uppercase
                    text-brand
                    transition-all
                    hover:bg-brand
                    hover:text-white
                  "
                >
                  Import Default Links
                </button>
              </form>
            </div>
          ) : (
            /* ===============================================
               EXISTING LINKS
               =============================================== */

            <div
              className="
                mt-6
                grid
                gap-4
              "
            >
              {links.map(
                (
                  footerLink
                ) => (
                  <div
                    key={
                      footerLink.id
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
                        flex-wrap
                        items-center
                        justify-between
                        gap-3
                        border-b
                        border-brand/10
                        bg-[#f7f9fc]
                        px-5
                        py-4
                      "
                    >
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
                              font-bold
                              uppercase
                              text-brand-deep
                            "
                          >
                            {
                              footerLink.label
                            }
                          </p>

                          <VisibilityBadge
                            visible={
                              footerLink.isVisible
                            }
                          />

                          <OrderBadge
                            value={
                              footerLink.sortOrder
                            }
                          />
                        </div>

                        <p
                          className="
                            mt-1
                            text-xs
                            text-slate-400
                          "
                        >
                          {
                            footerLink.href
                          }
                        </p>
                      </div>

                      {/* =====================================
                          SHOW / HIDE
                          ===================================== */}

                      <form
                        action={
                          toggleFooterLinkVisibility
                        }
                      >
                        <input
                          type="hidden"
                          name="linkId"
                          value={
                            footerLink.id
                          }
                        />

                        <VisibilityButton
                          visible={
                            footerLink.isVisible
                          }
                        />
                      </form>
                    </div>

                    {/* =======================================
                        EDIT LINK FORM
                        ======================================= */}

                    <form
                      action={
                        updateFooterLink
                      }
                      className="
                        p-5
                        md:p-6
                      "
                    >
                      <input
                        type="hidden"
                        name="linkId"
                        value={
                          footerLink.id
                        }
                      />

                      <div
                        className="
                          grid
                          gap-5
                          lg:grid-cols-[1fr_1.4fr_130px]
                        "
                      >
                        <Field label="Label">
                          <input
                            name="label"
                            required
                            maxLength={
                              120
                            }
                            defaultValue={
                              footerLink.label
                            }
                            className={
                              inputClass
                            }
                          />
                        </Field>

                        <Field label="Link">
                          <input
                            name="href"
                            required
                            maxLength={
                              500
                            }
                            defaultValue={
                              footerLink.href
                            }
                            className={
                              inputClass
                            }
                          />
                        </Field>

                        <Field label="Order">
                          <input
                            name="sortOrder"
                            type="number"
                            min="0"
                            step="1"
                            defaultValue={
                              footerLink.sortOrder
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
                          border-t
                          border-brand/10
                          pt-5
                          sm:flex-row
                          sm:items-center
                          sm:justify-between
                        "
                      >
                        <label
                          className="
                            flex
                            items-center
                            gap-3
                          "
                        >
                          <input
                            name="isVisible"
                            type="checkbox"
                            defaultChecked={
                              footerLink.isVisible
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
                              text-slate-600
                            "
                          >
                            Visible
                          </span>
                        </label>

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
                      </div>
                    </form>

                    {/* =======================================
                        DELETE

                        IMPORTANT:
                        This stays OUTSIDE the update <form>.
                        Therefore the delete component can
                        safely contain its own confirmation
                        form without nested forms.
                        ======================================= */}

                    <div
                      className="
                        flex
                        items-center
                        justify-end
                        border-t
                        border-brand/10
                        bg-red-50/30
                        px-5
                        py-4
                      "
                    >
                      <DeleteFooterItemButton
                        type="link"
                        id={
                          footerLink.id
                        }
                        label={
                          footerLink.label
                        }
                        detail={
                          footerLink.href
                        }
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        {/* ===================================================
            SOCIAL LINKS
            =================================================== */}

        <section
          id="footer-social-links"
          className="
            mt-8
            rounded-2xl
            border
            border-brand/10
            bg-white
            p-6
            md:p-8
          "
        >
          <SectionHeading
            icon={
              <Share2
                className="h-5 w-5"
              />
            }
            eyebrow="Social"
            title="Social Profiles"
            description="Control the social icons displayed in the Footer."
          />

          {/* =================================================
              ADD SOCIAL
              ================================================= */}

          <form
            action={
              createFooterSocialLink
            }
            className="
              mt-7
              rounded-2xl
              border
              border-brand/10
              bg-[#f7f9fc]
              p-5
            "
          >
            <div
              className="
                grid
                gap-5
                lg:grid-cols-[220px_1fr_130px]
              "
            >
              <Field label="Platform">
                <select
                  name="platform"
                  required
                  className={
                    inputClass
                  }
                >
                  {SOCIAL_PLATFORMS.map(
                    (
                      platform
                    ) => (
                      <option
                        key={
                          platform
                        }
                        value={
                          platform
                        }
                      >
                        {formatPlatform(
                          platform
                        )}
                      </option>
                    )
                  )}
                </select>
              </Field>

              <Field label="Profile URL">
                <input
                  name="url"
                  required
                  maxLength={1000}
                  placeholder="https://instagram.com/gamex"
                  className={
                    inputClass
                  }
                />
              </Field>

              <Field label="Order">
                <input
                  name="sortOrder"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue={
                    socials.length
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
              <label
                className="
                  flex
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
                    text-slate-600
                  "
                >
                  Visible
                </span>
              </label>

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
                  text-xs
                  font-bold
                  text-white
                  transition-all
                  hover:bg-brand-soft
                "
              >
                <Plus
                  className="h-4 w-4"
                />

                Add Social
              </button>
            </div>
          </form>

          {/* =================================================
              EMPTY SOCIALS
              ================================================= */}

          {socials.length === 0 ? (
            <div
              className="
                mt-6
                rounded-2xl
                border
                border-dashed
                border-brand/20
                bg-[#f7f9fc]
                p-10
                text-center
                text-sm
                text-slate-500
              "
            >
              No Footer social profiles yet.
            </div>
          ) : (
            /* ===============================================
               EXISTING SOCIALS
               =============================================== */

            <div
              className="
                mt-6
                grid
                gap-4
              "
            >
              {socials.map(
                (
                  social
                ) => (
                  <div
                    key={
                      social.id
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
                        SOCIAL HEADER
                        ======================================= */}

                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-4
                        border-b
                        border-brand/10
                        bg-[#f7f9fc]
                        px-5
                        py-4
                      "
                    >
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
                              font-bold
                              uppercase
                              text-brand-deep
                            "
                          >
                            {formatPlatform(
                              social.platform
                            )}
                          </p>

                          <VisibilityBadge
                            visible={
                              social.isVisible
                            }
                          />

                          <OrderBadge
                            value={
                              social.sortOrder
                            }
                          />
                        </div>

                        <p
                          className="
                            mt-1
                            max-w-xl
                            truncate
                            text-xs
                            text-slate-400
                          "
                        >
                          {
                            social.url
                          }
                        </p>
                      </div>

                      {/* =====================================
                          SHOW / HIDE
                          ===================================== */}

                      <form
                        action={
                          toggleFooterSocialLinkVisibility
                        }
                      >
                        <input
                          type="hidden"
                          name="socialId"
                          value={
                            social.id
                          }
                        />

                        <VisibilityButton
                          visible={
                            social.isVisible
                          }
                        />
                      </form>
                    </div>

                    {/* =======================================
                        EDIT SOCIAL FORM
                        ======================================= */}

                    <form
                      action={
                        updateFooterSocialLink
                      }
                      className="
                        p-5
                        md:p-6
                      "
                    >
                      <input
                        type="hidden"
                        name="socialId"
                        value={
                          social.id
                        }
                      />

                      <div
                        className="
                          grid
                          gap-5
                          lg:grid-cols-[220px_1fr_130px]
                        "
                      >
                        <Field label="Platform">
                          <select
                            name="platform"
                            defaultValue={
                              social.platform
                            }
                            className={
                              inputClass
                            }
                          >
                            {SOCIAL_PLATFORMS.map(
                              (
                                platform
                              ) => (
                                <option
                                  key={
                                    platform
                                  }
                                  value={
                                    platform
                                  }
                                >
                                  {formatPlatform(
                                    platform
                                  )}
                                </option>
                              )
                            )}
                          </select>
                        </Field>

                        <Field label="Profile URL">
                          <input
                            name="url"
                            required
                            maxLength={
                              1000
                            }
                            defaultValue={
                              social.url
                            }
                            className={
                              inputClass
                            }
                          />
                        </Field>

                        <Field label="Order">
                          <input
                            name="sortOrder"
                            type="number"
                            min="0"
                            step="1"
                            defaultValue={
                              social.sortOrder
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
                          border-t
                          border-brand/10
                          pt-5
                          sm:flex-row
                          sm:items-center
                          sm:justify-between
                        "
                      >
                        <label
                          className="
                            flex
                            items-center
                            gap-3
                          "
                        >
                          <input
                            name="isVisible"
                            type="checkbox"
                            defaultChecked={
                              social.isVisible
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
                              text-slate-600
                            "
                          >
                            Visible
                          </span>
                        </label>

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
                      </div>
                    </form>

                    {/* =======================================
                        DELETE SOCIAL
                        ======================================= */}

                    <div
                      className="
                        flex
                        items-center
                        justify-end
                        border-t
                        border-brand/10
                        bg-red-50/30
                        px-5
                        py-4
                      "
                    >
                      <DeleteFooterItemButton
                        type="social"
                        id={
                          social.id
                        }
                        label={
                          formatPlatform(
                            social.platform
                          )
                        }
                        detail={
                          social.url
                        }
                      />
                    </div>
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
   SECTION HEADING
   ========================================================= */

function SectionHeading({
  icon,
  eyebrow,
  title,
  description,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div
      className="
        flex
        items-start
        justify-between
        gap-5
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

        <p
          className="
            mt-2
            max-w-xl
            text-sm
            text-slate-500
          "
        >
          {description}
        </p>
      </div>

      <div
        className="
          grid
          h-12
          w-12
          shrink-0
          place-items-center
          rounded-xl
          bg-brand/[0.08]
          text-brand
        "
      >
        {icon}
      </div>
    </div>
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
   VISIBILITY BADGE
   ========================================================= */

function VisibilityBadge({
  visible,
}: {
  visible: boolean;
}) {
  return (
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
          visible
            ? "bg-emerald-50 text-emerald-700"
            : "bg-slate-100 text-slate-500"
        }
      `}
    >
      {visible
        ? "Visible"
        : "Hidden"}
    </span>
  );
}

/* =========================================================
   ORDER BADGE
   ========================================================= */

function OrderBadge({
  value,
}: {
  value: number;
}) {
  return (
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
      Order {value}
    </span>
  );
}

/* =========================================================
   SHOW / HIDE BUTTON
   ========================================================= */

function VisibilityButton({
  visible,
}: {
  visible: boolean;
}) {
  return (
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
      {visible ? (
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
  );
}

/* =========================================================
   PLATFORM FORMATTER
   ========================================================= */

function formatPlatform(
  platform: string
) {
  const specialNames:
    Record<
      string,
      string
    > = {
      x: "X",

      youtube:
        "YouTube",

      whatsapp:
        "WhatsApp",

      linkedin:
        "LinkedIn",

      tiktok:
        "TikTok",
    };

  return (
    specialNames[
      platform
    ] ??
    platform
      .charAt(0)
      .toUpperCase() +
      platform.slice(1)
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