import Link from "next/link";

import {
  ArrowLeft,
  Clock3,
  Eye,
  EyeOff,
  Mail,
  MapPin,
  Phone,
  Save,
} from "lucide-react";

import {
  asc,
  eq,
} from "drizzle-orm";

import { db } from "@/db";

import {
  contactSettings,
  contactSocialLinks,
} from "@/db/schema";

import { requireAdmin } from "@/lib/admin-auth";

import { saveContactSettings } from "./actions";

import SocialLinksManager from "./SocialLinksManager";

/* =========================================================
   TYPES
   ========================================================= */

type ContactAdminPageProps = {
  searchParams: Promise<{
    saved?: string;
    error?: string;

    socialCreated?: string;
    socialUpdated?: string;
    socialDeleted?: string;
    socialVisibility?: string;
  }>;
};

/* =========================================================
   DEFAULT CONTACT SETTINGS
   ========================================================= */

const DEFAULT_CONTACT_SETTINGS = {
  id: "main",

  eyebrow: "Contact Us",

  title: "Let's build your dream rig",

  subtitle:
    "Have a question, need help choosing parts, or want a custom build? Get in touch with the Gamex team.",

  emailLabel: "Email",

  email: "hello@gamex.gg",

  phoneLabel: "Phone",

  phone: "0303-6009123",

  addressLabel: "HQ",

  address:
    "17-A Airport Road Divine Garden Lahore",

  hoursLabel: "Hours",

  hours:
    "24/7 — we never sleep",

  socialHeading:
    "Follow Gamex",

  /*
   * Legacy fields.
   *
   * We keep these temporarily because they still
   * exist in contact_settings.
   *
   * The public website will eventually use
   * contact_social_links instead.
   */
  xUrl: "",

  instagramUrl: "",

  youtubeUrl: "",

  twitchUrl: "",

  nameLabel: "Name",

  namePlaceholder:
    "Your name",

  formEmailLabel: "Email",

  formEmailPlaceholder:
    "you@example.com",

  subjectLabel: "Subject",

  subjectPlaceholder:
    "What can we help you with?",

  messageLabel: "Message",

  messagePlaceholder:
    "Tell us what you're looking for...",

  submitButtonText:
    "Send Message",

  isVisible: true,
};

/* =========================================================
   PAGE
   ========================================================= */

export default async function ContactAdminPage({
  searchParams,
}: ContactAdminPageProps) {
  await requireAdmin();

  const query =
    await searchParams;

  /* =========================================================
     LOAD CONTACT SETTINGS
     ========================================================= */

  const settingsRows =
    await db
      .select()
      .from(contactSettings)
      .where(
        eq(
          contactSettings.id,
          "main"
        )
      )
      .limit(1);

  const settings =
    settingsRows[0] ??
    DEFAULT_CONTACT_SETTINGS;

  /* =========================================================
     LOAD SOCIAL LINKS
     ========================================================= */

  const socialLinks =
    await db
      .select({
        id:
          contactSocialLinks.id,

        platform:
          contactSocialLinks.platform,

        url:
          contactSocialLinks.url,

        isVisible:
          contactSocialLinks.isVisible,

        sortOrder:
          contactSocialLinks.sortOrder,
      })
      .from(
        contactSocialLinks
      )
      .orderBy(
        asc(
          contactSocialLinks.sortOrder
        ),
        asc(
          contactSocialLinks.id
        )
      );

  /* =========================================================
     PAGE
     ========================================================= */

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <header className="border-b border-brand/10 bg-white">
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

            <p className="mt-0.5 text-xs text-slate-500">
              Website Content
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
            PAGE TITLE
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
            Contact Section
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
            Manage the contact section, public contact
            information, social profiles, contact form text,
            and section visibility.
          </p>
        </div>

        {/* ===================================================
            CONTACT SAVED
            =================================================== */}

        {query.saved === "1" ? (
          <SuccessMessage>
            Contact section settings saved successfully.
          </SuccessMessage>
        ) : null}

        {/* ===================================================
            SOCIAL CREATED
            =================================================== */}

        {query.socialCreated === "1" ? (
          <SuccessMessage>
            Social link added successfully.
          </SuccessMessage>
        ) : null}

        {/* ===================================================
            SOCIAL UPDATED
            =================================================== */}

        {query.socialUpdated === "1" ? (
          <SuccessMessage>
            Social link updated successfully.
          </SuccessMessage>
        ) : null}

        {/* ===================================================
            SOCIAL VISIBILITY
            =================================================== */}

        {query.socialVisibility === "1" ? (
          <SuccessMessage>
            Social link visibility updated.
          </SuccessMessage>
        ) : null}

        {/* ===================================================
            SOCIAL DELETED
            =================================================== */}

        {query.socialDeleted === "1" ? (
          <SuccessMessage>
            Social link deleted successfully.
          </SuccessMessage>
        ) : null}

        {/* ===================================================
            ERROR
            =================================================== */}

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
            CONTACT SETTINGS FORM
            =================================================== */}

        <form
          action={
            saveContactSettings
          }
          className="mt-8 space-y-8"
        >
          {/* =================================================
              SECTION SETTINGS
              ================================================= */}

          <SectionCard
            eyebrow="Section Settings"
            title="Heading & Visibility"
          >
            <div
              className="
                grid
                gap-6
                md:grid-cols-2
              "
            >
              {/* EYEBROW */}

              <Field label="Eyebrow">
                <input
                  name="eyebrow"
                  type="text"
                  required
                  maxLength={255}
                  defaultValue={
                    settings.eyebrow
                  }
                  className={inputClass}
                />
              </Field>

              {/* TITLE */}

              <Field label="Section Title">
                <input
                  name="title"
                  type="text"
                  required
                  maxLength={255}
                  defaultValue={
                    settings.title
                  }
                  className={inputClass}
                />
              </Field>

              {/* SUBTITLE */}

              <div className="md:col-span-2">
                <Field label="Subtitle">
                  <textarea
                    name="subtitle"
                    required
                    rows={4}
                    defaultValue={
                      settings.subtitle
                    }
                    className={
                      textareaClass
                    }
                  />
                </Field>
              </div>
            </div>

            {/* ===============================================
                VISIBILITY
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
                htmlFor="isVisible"
                className="
                  flex
                  cursor-pointer
                  items-start
                  gap-3
                "
              >
                <input
                  id="isVisible"
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
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}

                    Show Contact section on homepage
                  </span>

                  <span
                    className="
                      mt-1
                      block
                      text-xs
                      leading-relaxed
                      text-slate-500
                    "
                  >
                    Hiding this section does not delete contact
                    settings or submitted customer messages.
                  </span>
                </span>
              </label>
            </div>
          </SectionCard>

          {/* =================================================
              PUBLIC CONTACT INFORMATION
              ================================================= */}

          <SectionCard
            eyebrow="Public Information"
            title="Contact Details"
          >
            <div
              className="
                grid
                gap-6
                lg:grid-cols-2
              "
            >
              {/* =============================================
                  EMAIL
                  ============================================= */}

              <ContactFieldGroup
                icon={
                  <Mail className="h-5 w-5" />
                }
                title="Email"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Label">
                    <input
                      name="emailLabel"
                      required
                      maxLength={100}
                      defaultValue={
                        settings.emailLabel
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Email Address">
                    <input
                      name="email"
                      type="email"
                      required
                      maxLength={255}
                      defaultValue={
                        settings.email
                      }
                      className={inputClass}
                    />
                  </Field>
                </div>
              </ContactFieldGroup>

              {/* =============================================
                  PHONE
                  ============================================= */}

              <ContactFieldGroup
                icon={
                  <Phone className="h-5 w-5" />
                }
                title="Phone"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Label">
                    <input
                      name="phoneLabel"
                      required
                      maxLength={100}
                      defaultValue={
                        settings.phoneLabel
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Phone Number">
                    <input
                      name="phone"
                      required
                      maxLength={100}
                      defaultValue={
                        settings.phone
                      }
                      className={inputClass}
                    />
                  </Field>
                </div>
              </ContactFieldGroup>

              {/* =============================================
                  ADDRESS
                  ============================================= */}

              <ContactFieldGroup
                icon={
                  <MapPin className="h-5 w-5" />
                }
                title="Address"
              >
                <div className="grid gap-4">
                  <Field label="Label">
                    <input
                      name="addressLabel"
                      required
                      maxLength={100}
                      defaultValue={
                        settings.addressLabel
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Address">
                    <textarea
                      name="address"
                      required
                      rows={3}
                      defaultValue={
                        settings.address
                      }
                      className={
                        textareaClass
                      }
                    />
                  </Field>
                </div>
              </ContactFieldGroup>

              {/* =============================================
                  HOURS
                  ============================================= */}

              <ContactFieldGroup
                icon={
                  <Clock3 className="h-5 w-5" />
                }
                title="Business Hours"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Label">
                    <input
                      name="hoursLabel"
                      required
                      maxLength={100}
                      defaultValue={
                        settings.hoursLabel
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Hours">
                    <input
                      name="hours"
                      required
                      maxLength={255}
                      defaultValue={
                        settings.hours
                      }
                      className={inputClass}
                    />
                  </Field>
                </div>
              </ContactFieldGroup>
            </div>
          </SectionCard>

          {/* =================================================
              SOCIAL HEADING
              ================================================= */}

          <SectionCard
            eyebrow="Social Media"
            title="Social Section Settings"
          >
            <Field label="Social Heading">
              <input
                name="socialHeading"
                required
                maxLength={255}
                defaultValue={
                  settings.socialHeading
                }
                className={inputClass}
              />
            </Field>

            <p
              className="
                mt-3
                text-xs
                leading-relaxed
                text-slate-400
              "
            >
              Social profiles themselves are managed separately
              below using the Social Links Manager.
            </p>

            {/* ===============================================
                LEGACY SOCIAL VALUES

                These remain hidden so saving the Contact form
                does not unexpectedly erase existing values
                while we transition to contact_social_links.
                =============================================== */}

            <input
              type="hidden"
              name="xUrl"
              value={
                settings.xUrl
              }
            />

            <input
              type="hidden"
              name="instagramUrl"
              value={
                settings.instagramUrl
              }
            />

            <input
              type="hidden"
              name="youtubeUrl"
              value={
                settings.youtubeUrl
              }
            />

            <input
              type="hidden"
              name="twitchUrl"
              value={
                settings.twitchUrl
              }
            />
          </SectionCard>

          {/* =================================================
              CONTACT FORM SETTINGS
              ================================================= */}

          <SectionCard
            eyebrow="Contact Form"
            title="Labels & Placeholders"
          >
            <div
              className="
                grid
                gap-6
                md:grid-cols-2
              "
            >
              {/* =============================================
                  NAME
                  ============================================= */}

              <Field label="Name Label">
                <input
                  name="nameLabel"
                  required
                  maxLength={100}
                  defaultValue={
                    settings.nameLabel
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Name Placeholder">
                <input
                  name="namePlaceholder"
                  required
                  maxLength={255}
                  defaultValue={
                    settings.namePlaceholder
                  }
                  className={inputClass}
                />
              </Field>

              {/* =============================================
                  FORM EMAIL
                  ============================================= */}

              <Field label="Email Label">
                <input
                  name="formEmailLabel"
                  required
                  maxLength={100}
                  defaultValue={
                    settings.formEmailLabel
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Email Placeholder">
                <input
                  name="formEmailPlaceholder"
                  required
                  maxLength={255}
                  defaultValue={
                    settings.formEmailPlaceholder
                  }
                  className={inputClass}
                />
              </Field>

              {/* =============================================
                  SUBJECT
                  ============================================= */}

              <Field label="Subject Label">
                <input
                  name="subjectLabel"
                  required
                  maxLength={100}
                  defaultValue={
                    settings.subjectLabel
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Subject Placeholder">
                <input
                  name="subjectPlaceholder"
                  required
                  maxLength={500}
                  defaultValue={
                    settings.subjectPlaceholder
                  }
                  className={inputClass}
                />
              </Field>

              {/* =============================================
                  MESSAGE
                  ============================================= */}

              <Field label="Message Label">
                <input
                  name="messageLabel"
                  required
                  maxLength={100}
                  defaultValue={
                    settings.messageLabel
                  }
                  className={inputClass}
                />
              </Field>

              {/* =============================================
                  BUTTON
                  ============================================= */}

              <Field label="Submit Button Text">
                <input
                  name="submitButtonText"
                  required
                  maxLength={120}
                  defaultValue={
                    settings.submitButtonText
                  }
                  className={inputClass}
                />
              </Field>

              {/* =============================================
                  MESSAGE PLACEHOLDER
                  ============================================= */}

              <div className="md:col-span-2">
                <Field label="Message Placeholder">
                  <textarea
                    name="messagePlaceholder"
                    required
                    rows={4}
                    defaultValue={
                      settings.messagePlaceholder
                    }
                    className={
                      textareaClass
                    }
                  />
                </Field>
              </div>
            </div>
          </SectionCard>

          {/* =================================================
              SAVE CONTACT SETTINGS
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
              <Save className="h-4 w-4" />

              Save Contact Settings
            </button>
          </div>
        </form>

        {/* ===================================================
            DYNAMIC SOCIAL LINKS MANAGER

            IMPORTANT:
            This is outside the Contact settings <form>
            because SocialLinksManager contains its own forms.
            =================================================== */}

        <section
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
          <SocialLinksManager
            socialLinks={
              socialLinks
            }
          />
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
  children: React.ReactNode;
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
  children: React.ReactNode;
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
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>
        {label}
      </label>

      {children}
    </div>
  );
}

/* =========================================================
   CONTACT FIELD GROUP
   ========================================================= */

function ContactFieldGroup({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-brand/10
        bg-[#f7f9fc]
        p-5
      "
    >
      <div
        className="
          mb-5
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
            bg-brand/[0.08]
            text-brand
          "
        >
          {icon}
        </div>

        <h3
          className="
            font-display
            text-sm
            font-bold
            uppercase
            text-brand-deep
          "
        >
          {title}
        </h3>
      </div>

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

const textareaClass = `
  w-full
  resize-y
  rounded-xl
  border
  border-brand/15
  bg-[#f7f9fc]
  px-4
  py-3.5
  text-sm
  leading-relaxed
  text-brand-deep
  outline-none
  transition-all
  placeholder:text-slate-400
  hover:border-brand/25
  focus:border-brand/60
  focus:bg-white
  focus:shadow-[0_0_0_3px_rgba(23,49,96,0.10)]
`;