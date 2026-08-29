"use server";

import { createHash } from "crypto";

import {
  and,
  eq,
  ne,
} from "drizzle-orm";

import {
  revalidatePath,
} from "next/cache";

import {
  redirect,
} from "next/navigation";

import { db } from "@/db";

import {
  blogPosts,
  blogSettings,
} from "@/db/schema";

import {
  requireAdmin,
} from "@/lib/admin-auth";

/* =========================================================
   CONSTANTS
   ========================================================= */

const BLOG_SETTINGS_ID =
  "main";

const MAX_IMAGE_SIZE =
  5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

/* =========================================================
   BASIC HELPERS
   ========================================================= */

function getText(
  formData: FormData,
  name: string
) {
  return String(
    formData.get(name) ?? ""
  ).trim();
}

/* =========================================================
   REDIRECT HELPERS
   ========================================================= */

function redirectBlogError(
  message: string
): never {
  redirect(
    `/admin/blog?error=${encodeURIComponent(
      message
    )}`
  );
}

function redirectNewPostError(
  message: string
): never {
  redirect(
    `/admin/blog/new?error=${encodeURIComponent(
      message
    )}`
  );
}

function redirectEditPostError(
  id: number,
  message: string
): never {
  redirect(
    `/admin/blog/${id}/edit?error=${encodeURIComponent(
      message
    )}`
  );
}

/* =========================================================
   BLOG ID
   ========================================================= */

function parsePostId(
  formData: FormData
) {
  const raw =
    getText(
      formData,
      "postId"
    );

  const id =
    Number.parseInt(
      raw,
      10
    );

  if (
    !Number.isFinite(id) ||
    id <= 0
  ) {
    redirectBlogError(
      "Invalid Blog post."
    );
  }

  return id;
}

/* =========================================================
   SORT ORDER
   ========================================================= */

function parseSortOrder(
  formData: FormData,
  onError: (
    message: string
  ) => never
) {
  const raw =
    getText(
      formData,
      "sortOrder"
    );

  if (!raw) {
    return 0;
  }

  const value =
    Number.parseInt(
      raw,
      10
    );

  if (
    !Number.isFinite(value) ||
    value < 0
  ) {
    onError(
      "Display order must be zero or greater."
    );
  }

  return value;
}

/* =========================================================
   SLUG
   ========================================================= */

function slugify(
  value: string
) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      ""
    )
    .slice(0, 255);
}

/* =========================================================
   IMAGE URL
   ========================================================= */

function isValidImageUrl(
  value: string
) {
  if (!value) {
    return true;
  }

  try {
    const url =
      new URL(value);

    return (
      url.protocol ===
        "https:" ||
      url.protocol ===
        "http:"
    );
  } catch {
    return false;
  }
}

/* =========================================================
   PUBLICATION DATE
   ========================================================= */

function parsePublishedDate(
  formData: FormData,
  onError: (
    message: string
  ) => never
) {
  const raw =
    getText(
      formData,
      "publishedDate"
    );

  if (!raw) {
    return new Date();
  }

  /*
   * Admin input:
   *
   * 2026-08-30
   *
   * Noon UTC avoids date shifting around midnight
   * when displayed in other time zones.
   */
  const date =
    new Date(
      `${raw}T12:00:00.000Z`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    onError(
      "Please enter a valid publication date."
    );
  }

  return date;
}

/* =========================================================
   CLOUDINARY SIGNATURE
   ========================================================= */

function createCloudinarySignature(
  timestamp: number,
  folder: string,
  apiSecret: string
) {
  const value =
    `folder=${folder}&timestamp=${timestamp}${apiSecret}`;

  return createHash(
    "sha1"
  )
    .update(value)
    .digest("hex");
}

/* =========================================================
   UPLOAD BLOG IMAGE
   ========================================================= */

async function uploadBlogImage(
  file: File,
  onError: (
    message: string
  ) => never
) {
  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.type
    )
  ) {
    onError(
      "Blog image must be JPG, PNG, or WebP."
    );
  }

  if (
    file.size >
    MAX_IMAGE_SIZE
  ) {
    onError(
      "Blog image must be 5 MB or smaller."
    );
  }

  const cloudName =
    process.env
      .CLOUDINARY_CLOUD_NAME;

  const apiKey =
    process.env
      .CLOUDINARY_API_KEY;

  const apiSecret =
    process.env
      .CLOUDINARY_API_SECRET;

  if (
    !cloudName ||
    !apiKey ||
    !apiSecret
  ) {
    onError(
      "Cloudinary is not configured."
    );
  }

  const timestamp =
    Math.floor(
      Date.now() / 1000
    );

  const folder =
    "gamex/blog";

  const signature =
    createCloudinarySignature(
      timestamp,
      folder,
      apiSecret
    );

  const uploadData =
    new FormData();

  uploadData.append(
    "file",
    file
  );

  uploadData.append(
    "api_key",
    apiKey
  );

  uploadData.append(
    "timestamp",
    String(timestamp)
  );

  uploadData.append(
    "folder",
    folder
  );

  uploadData.append(
    "signature",
    signature
  );

  const response =
    await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: uploadData,
      }
    );

  if (!response.ok) {
    onError(
      "Blog image upload failed."
    );
  }

  const result =
    (await response.json()) as {
      secure_url?: string;
    };

  if (
    !result.secure_url
  ) {
    onError(
      "Cloudinary did not return an image URL."
    );
  }

  return result.secure_url;
}

/* =========================================================
   REVALIDATION
   ========================================================= */

function refreshBlog() {
  revalidatePath("/");
  revalidatePath(
    "/admin/blog"
  );

  /*
   * This also prepares us for the article pages
   * we will add later.
   */
  revalidatePath(
    "/blog",
    "layout"
  );
}

/* =========================================================
   SAVE BLOG SECTION SETTINGS
   ========================================================= */

export async function saveBlogSettings(
  formData: FormData
) {
  await requireAdmin();

  const eyebrow =
    getText(
      formData,
      "eyebrow"
    );

  const title =
    getText(
      formData,
      "title"
    );

  const accent =
    getText(
      formData,
      "accent"
    );

  const subtitle =
    getText(
      formData,
      "subtitle"
    );

  const readMoreText =
    getText(
      formData,
      "readMoreText"
    );

  const isVisible =
    formData.get(
      "isVisible"
    ) === "on";

  if (!eyebrow) {
    redirectBlogError(
      "Blog eyebrow is required."
    );
  }

  if (
    eyebrow.length >
    255
  ) {
    redirectBlogError(
      "Blog eyebrow is too long."
    );
  }

  if (!title) {
    redirectBlogError(
      "Blog title is required."
    );
  }

  if (
    title.length >
    255
  ) {
    redirectBlogError(
      "Blog title is too long."
    );
  }

  if (
    accent.length >
    120
  ) {
    redirectBlogError(
      "Accent text is too long."
    );
  }

  if (!subtitle) {
    redirectBlogError(
      "Blog subtitle is required."
    );
  }

  if (!readMoreText) {
    redirectBlogError(
      "Read-more button text is required."
    );
  }

  if (
    readMoreText.length >
    100
  ) {
    redirectBlogError(
      "Read-more text is too long."
    );
  }

  await db
    .insert(
      blogSettings
    )
    .values({
      id:
        BLOG_SETTINGS_ID,

      eyebrow,
      title,
      accent,
      subtitle,
      readMoreText,
      isVisible,
    })
    .onConflictDoUpdate({
      target:
        blogSettings.id,

      set: {
        eyebrow,
        title,
        accent,
        subtitle,
        readMoreText,
        isVisible,

        updatedAt:
          new Date(),
      },
    });

  refreshBlog();

  redirect(
    "/admin/blog?settingsSaved=1"
  );
}

/* =========================================================
   CREATE BLOG POST
   ========================================================= */

export async function createBlogPost(
  formData: FormData
) {
  await requireAdmin();

  const onError =
    redirectNewPostError;

  const title =
    getText(
      formData,
      "title"
    );

  const rawSlug =
    getText(
      formData,
      "slug"
    );

  const category =
    getText(
      formData,
      "category"
    );

  const excerpt =
    getText(
      formData,
      "excerpt"
    );

  const content =
    getText(
      formData,
      "content"
    );

  const readTime =
    getText(
      formData,
      "readTime"
    );

  const sortOrder =
    parseSortOrder(
      formData,
      onError
    );

  const publishedAt =
    parsePublishedDate(
      formData,
      onError
    );

  const isVisible =
    formData.get(
      "isVisible"
    ) === "on";

  /* =======================================================
     VALIDATE TEXT
     ======================================================= */

  if (!title) {
    onError(
      "Post title is required."
    );
  }

  if (
    title.length >
    255
  ) {
    onError(
      "Post title is too long."
    );
  }

  const slug =
    slugify(
      rawSlug || title
    );

  if (!slug) {
    onError(
      "A valid post slug is required."
    );
  }

  if (!category) {
    onError(
      "Post category is required."
    );
  }

  if (
    category.length >
    100
  ) {
    onError(
      "Post category is too long."
    );
  }

  if (!excerpt) {
    onError(
      "Post excerpt is required."
    );
  }

  if (!readTime) {
    onError(
      "Read time is required."
    );
  }

  if (
    readTime.length >
    60
  ) {
    onError(
      "Read time is too long."
    );
  }

  /* =======================================================
     UNIQUE SLUG
     ======================================================= */

  const existingSlug =
    await db
      .select({
        id:
          blogPosts.id,
      })
      .from(
        blogPosts
      )
      .where(
        eq(
          blogPosts.slug,
          slug
        )
      )
      .limit(1);

  if (
    existingSlug[0]
  ) {
    onError(
      "Another Blog post already uses this slug."
    );
  }

  /* =======================================================
     IMAGE
     ======================================================= */

  const imageUrl =
    getText(
      formData,
      "imageUrl"
    );

  if (
    imageUrl.length >
    1000
  ) {
    onError(
      "Image URL is too long."
    );
  }

  if (
    !isValidImageUrl(
      imageUrl
    )
  ) {
    onError(
      "Please enter a valid image URL."
    );
  }

  const imageFile =
    formData.get(
      "imageFile"
    );

  let image =
    imageUrl;

  /*
   * Uploaded file takes priority over URL.
   */
  if (
    imageFile instanceof
      File &&
    imageFile.size >
      0
  ) {
    image =
      await uploadBlogImage(
        imageFile,
        onError
      );
  }

  if (!image) {
    onError(
      "Please upload a Blog image or enter an image URL."
    );
  }

  /* =======================================================
     INSERT
     ======================================================= */

  await db
    .insert(
      blogPosts
    )
    .values({
      title,
      slug,
      category,
      excerpt,
      content,
      image,
      readTime,
      isVisible,
      sortOrder,
      publishedAt,
    });

  refreshBlog();

  redirect(
    "/admin/blog?created=1"
  );
}

/* =========================================================
   UPDATE BLOG POST
   ========================================================= */

export async function updateBlogPost(
  formData: FormData
) {
  await requireAdmin();

  const id =
    parsePostId(
      formData
    );

  const onError = (
    message: string
  ): never =>
    redirectEditPostError(
      id,
      message
    );

  const current =
    await db
      .select()
      .from(
        blogPosts
      )
      .where(
        eq(
          blogPosts.id,
          id
        )
      )
      .limit(1);

  const existingPost =
    current[0];

  if (!existingPost) {
    redirectBlogError(
      "Blog post could not be found."
    );
  }

  const title =
    getText(
      formData,
      "title"
    );

  const rawSlug =
    getText(
      formData,
      "slug"
    );

  const category =
    getText(
      formData,
      "category"
    );

  const excerpt =
    getText(
      formData,
      "excerpt"
    );

  const content =
    getText(
      formData,
      "content"
    );

  const readTime =
    getText(
      formData,
      "readTime"
    );

  const sortOrder =
    parseSortOrder(
      formData,
      onError
    );

  const publishedAt =
    parsePublishedDate(
      formData,
      onError
    );

  const isVisible =
    formData.get(
      "isVisible"
    ) === "on";

  if (!title) {
    onError(
      "Post title is required."
    );
  }

  if (
    title.length >
    255
  ) {
    onError(
      "Post title is too long."
    );
  }

  const slug =
    slugify(
      rawSlug || title
    );

  if (!slug) {
    onError(
      "A valid post slug is required."
    );
  }

  if (!category) {
    onError(
      "Post category is required."
    );
  }

  if (
    category.length >
    100
  ) {
    onError(
      "Post category is too long."
    );
  }

  if (!excerpt) {
    onError(
      "Post excerpt is required."
    );
  }

  if (!readTime) {
    onError(
      "Read time is required."
    );
  }

  /* =======================================================
     CHECK SLUG BELONGS TO ANOTHER POST
     ======================================================= */

  const duplicateSlug =
    await db
      .select({
        id:
          blogPosts.id,
      })
      .from(
        blogPosts
      )
      .where(
        and(
          eq(
            blogPosts.slug,
            slug
          ),
          ne(
            blogPosts.id,
            id
          )
        )
      )
      .limit(1);

  if (
    duplicateSlug[0]
  ) {
    onError(
      "Another Blog post already uses this slug."
    );
  }

  /* =======================================================
     IMAGE
     ======================================================= */

  const currentImage =
    getText(
      formData,
      "currentImage"
    );

  const imageUrl =
    getText(
      formData,
      "imageUrl"
    );

  if (
    imageUrl.length >
    1000
  ) {
    onError(
      "Image URL is too long."
    );
  }

  if (
    !isValidImageUrl(
      imageUrl
    )
  ) {
    onError(
      "Please enter a valid image URL."
    );
  }

  const imageFile =
    formData.get(
      "imageFile"
    );

  let image =
    currentImage ||
    existingPost.image;

  /*
   * URL replaces current image.
   */
  if (imageUrl) {
    image =
      imageUrl;
  }

  /*
   * File upload has highest priority.
   */
  if (
    imageFile instanceof
      File &&
    imageFile.size >
      0
  ) {
    image =
      await uploadBlogImage(
        imageFile,
        onError
      );
  }

  if (!image) {
    onError(
      "Blog image is required."
    );
  }

  /* =======================================================
     UPDATE
     ======================================================= */

  await db
    .update(
      blogPosts
    )
    .set({
      title,
      slug,
      category,
      excerpt,
      content,
      image,
      readTime,
      isVisible,
      sortOrder,
      publishedAt,

      updatedAt:
        new Date(),
    })
    .where(
      eq(
        blogPosts.id,
        id
      )
    );

  /*
   * If the slug changed, invalidate both the old
   * and new article URLs.
   */
  revalidatePath(
    `/blog/${existingPost.slug}`
  );

  revalidatePath(
    `/blog/${slug}`
  );

  refreshBlog();

  redirect(
    "/admin/blog?updated=1"
  );
}

/* =========================================================
   SHOW / HIDE BLOG POST
   ========================================================= */

export async function toggleBlogPostVisibility(
  formData: FormData
) {
  await requireAdmin();

  const id =
    parsePostId(
      formData
    );

  const rows =
    await db
      .select({
        isVisible:
          blogPosts.isVisible,

        slug:
          blogPosts.slug,
      })
      .from(
        blogPosts
      )
      .where(
        eq(
          blogPosts.id,
          id
        )
      )
      .limit(1);

  const post =
    rows[0];

  if (!post) {
    redirectBlogError(
      "Blog post could not be found."
    );
  }

  await db
    .update(
      blogPosts
    )
    .set({
      isVisible:
        !post.isVisible,

      updatedAt:
        new Date(),
    })
    .where(
      eq(
        blogPosts.id,
        id
      )
    );

  revalidatePath(
    `/blog/${post.slug}`
  );

  refreshBlog();

  redirect(
    "/admin/blog?visibilityUpdated=1"
  );
}

/* =========================================================
   DELETE BLOG POST
   ========================================================= */

export async function deleteBlogPost(
  formData: FormData
) {
  await requireAdmin();

  const id =
    parsePostId(
      formData
    );

  const rows =
    await db
      .select({
        slug:
          blogPosts.slug,
      })
      .from(
        blogPosts
      )
      .where(
        eq(
          blogPosts.id,
          id
        )
      )
      .limit(1);

  const post =
    rows[0];

  if (!post) {
    redirectBlogError(
      "Blog post could not be found."
    );
  }

  await db
    .delete(
      blogPosts
    )
    .where(
      eq(
        blogPosts.id,
        id
      )
    );

  revalidatePath(
    `/blog/${post.slug}`
  );

  refreshBlog();

  redirect(
    "/admin/blog?deleted=1"
  );
}