"use client";

import {
  Eye,
  EyeOff,
  Link2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaTwitch,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

import { FaDiscord } from "react-icons/fa";

import {
  createSocialLink,
  deleteSocialLink,
  toggleSocialLinkVisibility,
  updateSocialLink,
} from "./actions";

/* =========================================================
   TYPES
   ========================================================= */

export type AdminSocialLink = {
  id: number;
  platform: string;
  url: string;
  isVisible: boolean;
  sortOrder: number;
};

/* =========================================================
   SUPPORTED PLATFORMS
   ========================================================= */

const SOCIAL_PLATFORMS = [
  {
    value: "instagram",
    label: "Instagram",
    icon: FaInstagram,
  },
  {
    value: "tiktok",
    label: "TikTok",
    icon: FaTiktok,
  },
  {
    value: "facebook",
    label: "Facebook",
    icon: FaFacebookF,
  },
  {
    value: "youtube",
    label: "YouTube",
    icon: FaYoutube,
  },
  {
    value: "x",
    label: "X",
    icon: FaXTwitter,
  },
  {
    value: "twitch",
    label: "Twitch",
    icon: FaTwitch,
  },
  {
    value: "discord",
    label: "Discord",
    icon: FaDiscord,
  },
  {
    value: "whatsapp",
    label: "WhatsApp",
    icon: FaWhatsapp,
  },
  {
    value: "linkedin",
    label: "LinkedIn",
    icon: FaLinkedinIn,
  },
] as const;

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function SocialLinksManager({
  socialLinks,
}: {
  socialLinks: AdminSocialLink[];
}) {
  return (
    <div id="social-links">
      {/* =====================================================
          INTRO
          ===================================================== */}

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
          Social Media
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
          Social Links
        </h2>

        <p
          className="
            mt-2
            max-w-2xl
            text-sm
            leading-relaxed
            text-slate-500
          "
        >
          Add, edit, hide, reorder, or remove social media
          profiles. The correct brand icon is selected
          automatically from the platform.
        </p>
      </div>

      {/* =====================================================
          ADD NEW SOCIAL
          ===================================================== */}

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
              h-11
              w-11
              place-items-center
              rounded-xl
              bg-brand
              text-white
            "
          >
            <Plus className="h-5 w-5" />
          </div>

          <div>
            <h3
              className="
                font-display
                text-base
                font-extrabold
                uppercase
                text-brand-deep
              "
            >
              Add Social Link
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Choose a platform and enter the profile URL.
            </p>
          </div>
        </div>

        <form
          action={createSocialLink}
          className="mt-6"
        >
          {/* =================================================
              PLATFORM CHOOSER
              ================================================= */}

          <p className={labelClass}>
            Platform
          </p>

          <div
            className="
              grid
              grid-cols-2
              gap-3
              sm:grid-cols-3
              lg:grid-cols-5
            "
          >
            {SOCIAL_PLATFORMS.map(
              ({
                value,
                label,
                icon: Icon,
              }) => (
                <label
                  key={value}
                  className="
                    relative
                    cursor-pointer
                  "
                >
                  <input
                    type="radio"
                    name="platform"
                    value={value}
                    required
                    className="peer sr-only"
                  />

                  <span
                    className="
                      flex
                      min-h-24
                      flex-col
                      items-center
                      justify-center
                      gap-2.5

                      rounded-xl

                      border
                      border-brand/10

                      bg-white

                      px-3
                      py-4

                      text-center

                      transition-all

                      hover:border-brand/30
                      hover:bg-brand/[0.03]

                      peer-checked:border-brand
                      peer-checked:bg-brand/[0.08]
                      peer-checked:shadow-[0_0_0_2px_rgba(23,49,96,0.08)]
                    "
                  >
                    <Icon
                      className="
                        h-6
                        w-6
                        text-brand
                      "
                    />

                    <span
                      className="
                        text-xs
                        font-bold
                        text-brand-deep
                      "
                    >
                      {label}
                    </span>
                  </span>
                </label>
              )
            )}
          </div>

          {/* =================================================
              URL / ORDER
              ================================================= */}

          <div
            className="
              mt-6
              grid
              gap-5
              md:grid-cols-[1fr_160px]
            "
          >
            <div>
              <label
                htmlFor="newSocialUrl"
                className={labelClass}
              >
                Profile URL
              </label>

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
                  id="newSocialUrl"
                  name="url"
                  type="text"
                  required
                  placeholder="instagram.com/gamex"
                  className={`${inputClass} pl-11`}
                />
              </div>

              <p
                className="
                  mt-2
                  text-xs
                  text-slate-400
                "
              >
                You may enter the URL with or without
                https://
              </p>
            </div>

            <div>
              <label
                htmlFor="newSocialOrder"
                className={labelClass}
              >
                Display Order
              </label>

              <input
                id="newSocialOrder"
                name="sortOrder"
                type="number"
                min="0"
                step="1"
                defaultValue={
                  socialLinks.length
                }
                className={inputClass}
              />
            </div>
          </div>

          {/* =================================================
              VISIBILITY
              ================================================= */}

          <div
            className="
              mt-5
              flex
              flex-col
              gap-4
              rounded-xl
              border
              border-brand/10
              bg-white
              p-4
              sm:flex-row
              sm:items-center
              sm:justify-between
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
                defaultChecked
                className="
                  h-4
                  w-4
                  accent-[#173160]
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
                  Visible on website
                </span>

                <span
                  className="
                    block
                    text-xs
                    text-slate-400
                  "
                >
                  You can hide it later without deleting it.
                </span>
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
              <Plus className="h-4 w-4" />

              Add Social
            </button>
          </div>
        </form>
      </div>

      {/* =====================================================
          EXISTING SOCIAL LINKS
          ===================================================== */}

      <div className="mt-8">
        <div
          className="
            flex
            items-end
            justify-between
            gap-4
          "
        >
          <div>
            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-slate-400
              "
            >
              Current Profiles
            </p>

            <h3
              className="
                mt-1
                font-display
                text-xl
                font-extrabold
                uppercase
                text-brand-deep
              "
            >
              {socialLinks.length}{" "}
              {socialLinks.length === 1
                ? "Social Link"
                : "Social Links"}
            </h3>
          </div>
        </div>

        {/* ===================================================
            EMPTY STATE
            =================================================== */}

        {socialLinks.length === 0 ? (
          <div
            className="
              mt-5
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
              <Link2 className="h-5 w-5" />
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
              No Social Links Yet
            </p>

            <p
              className="
                mx-auto
                mt-2
                max-w-md
                text-sm
                leading-relaxed
                text-slate-500
              "
            >
              Add Instagram, TikTok, Facebook, YouTube,
              X, Discord, WhatsApp, LinkedIn, or Twitch
              using the form above.
            </p>
          </div>
        ) : (
          /* =================================================
             SOCIAL CARDS
             ================================================= */

          <div
            className="
              mt-5
              grid
              gap-5
            "
          >
            {socialLinks.map(
              (social) => (
                <SocialLinkEditor
                  key={social.id}
                  social={social}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   EXISTING SOCIAL LINK EDITOR
   ========================================================= */

function SocialLinkEditor({
  social,
}: {
  social: AdminSocialLink;
}) {
  const platform =
    getPlatform(
      social.platform
    );

  const Icon =
    platform.icon;

  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-brand/10
        bg-white
      "
    >
      {/* =====================================================
          SOCIAL HEADER
          ===================================================== */}

      <div
        className="
          flex
          flex-col
          gap-4

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
        <div
          className="
            flex
            min-w-0
            items-center
            gap-3
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

              bg-brand/[0.08]

              text-xl
              text-brand
            "
          >
            <Icon />
          </div>

          <div className="min-w-0">
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
                {platform.label}
              </p>

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
                    social.isVisible
                      ? `
                        bg-emerald-50
                        text-emerald-700
                      `
                      : `
                        bg-slate-100
                        text-slate-500
                      `
                  }
                `}
              >
                {social.isVisible
                  ? "Visible"
                  : "Hidden"}
              </span>
            </div>

            <p
              className="
                mt-1
                truncate
                text-xs
                text-slate-400
              "
            >
              {social.url}
            </p>
          </div>
        </div>

        {/* ===================================================
            QUICK VISIBILITY
            =================================================== */}

        <form
          action={
            toggleSocialLinkVisibility
          }
        >
          <input
            type="hidden"
            name="socialId"
            value={social.id}
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
            {social.isVisible ? (
              <>
                <EyeOff className="h-4 w-4" />

                Hide
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />

                Show
              </>
            )}
          </button>
        </form>
      </div>

      {/* =====================================================
          EDIT FORM
          ===================================================== */}

      <form
        action={updateSocialLink}
        className="
          p-5
          md:p-6
        "
      >
        <input
          type="hidden"
          name="socialId"
          value={social.id}
        />

        {/* ===================================================
            PLATFORM
            =================================================== */}

        <p className={labelClass}>
          Platform
        </p>

        <div
          className="
            grid
            grid-cols-3
            gap-2
            sm:grid-cols-5
            lg:grid-cols-9
          "
        >
          {SOCIAL_PLATFORMS.map(
            ({
              value,
              label,
              icon: PlatformIcon,
            }) => (
              <label
                key={value}
                className="
                  cursor-pointer
                "
                title={label}
              >
                <input
                  type="radio"
                  name="platform"
                  value={value}
                  defaultChecked={
                    social.platform ===
                    value
                  }
                  required
                  className="peer sr-only"
                />

                <span
                  className="
                    flex
                    min-h-16
                    items-center
                    justify-center

                    rounded-xl

                    border
                    border-brand/10

                    bg-[#f7f9fc]

                    text-xl
                    text-brand

                    transition-all

                    hover:border-brand/30

                    peer-checked:border-brand
                    peer-checked:bg-brand/[0.08]
                    peer-checked:shadow-[0_0_0_2px_rgba(23,49,96,0.08)]
                  "
                >
                  <PlatformIcon />
                </span>
              </label>
            )
          )}
        </div>

        {/* ===================================================
            URL / ORDER
            =================================================== */}

        <div
          className="
            mt-5
            grid
            gap-5
            md:grid-cols-[1fr_160px]
          "
        >
          <div>
            <label
              htmlFor={`social-url-${social.id}`}
              className={labelClass}
            >
              Profile URL
            </label>

            <input
              id={`social-url-${social.id}`}
              name="url"
              type="text"
              required
              defaultValue={
                social.url
              }
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor={`social-order-${social.id}`}
              className={labelClass}
            >
              Display Order
            </label>

            <input
              id={`social-order-${social.id}`}
              name="sortOrder"
              type="number"
              min="0"
              step="1"
              defaultValue={
                social.sortOrder
              }
              className={inputClass}
            />
          </div>
        </div>

        {/* ===================================================
            VISIBILITY + ACTIONS
            =================================================== */}

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
              cursor-pointer
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
                tracking-wider
                text-slate-600
              "
            >
              Visible on website
            </span>
          </label>

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
              <Save className="h-4 w-4" />

              Save Changes
            </button>
          </div>
        </div>
      </form>

      {/* =====================================================
          DELETE
          ===================================================== */}

      <div
        className="
          border-t
          border-red-100
          bg-red-50/40
          px-5
          py-4
          md:px-6
        "
      >
        <form
          action={
            deleteSocialLink
          }
        >
          <input
            type="hidden"
            name="socialId"
            value={social.id}
          />

          <button
            type="submit"
            className="
              inline-flex
              items-center
              gap-2

              rounded-lg

              border
              border-red-200

              bg-white

              px-3
              py-2

              text-xs
              font-bold
              text-red-600

              transition-all

              hover:border-red-600
              hover:bg-red-600
              hover:text-white
            "
          >
            <Trash2 className="h-4 w-4" />

            Delete {platform.label}
          </button>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   PLATFORM LOOKUP
   ========================================================= */

function getPlatform(
  value: string
) {
  return (
    SOCIAL_PLATFORMS.find(
      (platform) =>
        platform.value ===
        value
    ) ?? {
      value,
      label: value,
      icon: Link2,
    }
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