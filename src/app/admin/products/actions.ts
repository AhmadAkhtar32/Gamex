"use server";



import {

  createHash,

  randomUUID,

} from "node:crypto";



import {

  and,

  eq,

  or,

} from "drizzle-orm";



import {

  revalidatePath,

} from "next/cache";



import {

  redirect,

} from "next/navigation";



import {

  db,

} from "@/db";



import {

  catalogCategories,

  products,

} from "@/db/schema";



import {

  catalogSubcategories,

  productSubcategoryAssignments,

} from "@/db/catalog-extensions";



import {

  requireAdmin,

} from "@/lib/admin-auth";



import {

  resolveGalleryImages,

} from "@/lib/gallery-admin";



const MAX_IMAGE_SIZE =

  5 *

  1024 *

  1024;



const ALLOWED_IMAGE_TYPES = [

  "image/jpeg",

  "image/png",

  "image/webp",

];



function getText(

  formData: FormData,

  name: string

) {

  return String(

    formData.get(

      name

    ) ?? ""

  ).trim();

}



function redirectNewProductError(

  message: string

): never {

  redirect(

    `/admin/products/new?error=${encodeURIComponent(

      message

    )}`

  );

}



function redirectEditProductError(

  productId: string,

  message: string

): never {

  redirect(

    `/admin/products/${encodeURIComponent(

      productId

    )}/edit?error=${encodeURIComponent(

      message

    )}`

  );

}



function makeProductId(

  name: string

) {

  const slug =

    name

      .toLowerCase()

      .trim()

      .replace(

        /[^a-z0-9]+/g,

        "-"

      )

      .replace(

        /^-+|-+$/g,

        ""

      )

      .slice(

        0,

        60

      );



  return `${

    slug ||

    "product"

  }-${randomUUID().slice(

    0,

    8

  )}`;

}



function isValidImageUrl(

  value: string

) {

  try {

    const url =

      new URL(

        value

      );



    return (

      url.protocol ===

        "http:" ||

      url.protocol ===

        "https:"

    );

  } catch {

    return false;

  }

}



function createCloudinarySignature({

  timestamp,

  folder,

  apiSecret,

}: {

  timestamp: number;

  folder: string;

  apiSecret: string;

}) {

  return createHash(

    "sha1"

  )

    .update(

      `folder=${folder}&timestamp=${timestamp}${apiSecret}`

    )

    .digest(

      "hex"

    );

}



async function uploadProductImage(

  imageFile: File

) {

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

    throw new Error(

      "Image upload is not configured."

    );

  }



  if (

    imageFile.size >

    MAX_IMAGE_SIZE

  ) {

    throw new Error(

      "Image must be smaller than 5 MB."

    );

  }



  if (

    !ALLOWED_IMAGE_TYPES.includes(

      imageFile.type

    )

  ) {

    throw new Error(

      "Only JPG, PNG and WebP images are allowed."

    );

  }



  const folder =

    "gamex/products";



  const timestamp =

    Math.floor(

      Date.now() /

        1000

    );



  const signature =

    createCloudinarySignature({

      timestamp,

      folder,

      apiSecret,

    });



  const uploadForm =

    new FormData();



  uploadForm.append(

    "file",

    imageFile

  );



  uploadForm.append(

    "api_key",

    apiKey

  );



  uploadForm.append(

    "timestamp",

    String(

      timestamp

    )

  );



  uploadForm.append(

    "folder",

    folder

  );



  uploadForm.append(

    "signature",

    signature

  );



  const response =

    await fetch(

      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,

      {

        method:

          "POST",



        body:

          uploadForm,

      }

    );



  const result =

    (await response.json()) as {

      secure_url?: string;



      error?: {

        message?: string;

      };

    };



  if (

    !response.ok ||

    !result.secure_url

  ) {

    throw new Error(

      result.error

        ?.message ||

        "Image upload failed."

    );

  }



  return result.secure_url;

}



async function getProductCategory(

  slug: string

) {

  const rows =

    await db

      .select({

        id:

          catalogCategories.id,



        slug:

          catalogCategories.slug,



        isVisible:

          catalogCategories.isVisible,

      })

      .from(

        catalogCategories

      )

      .where(

        and(

          eq(

            catalogCategories.slug,

            slug

          ),



          or(

            eq(

              catalogCategories.appliesTo,

              "product"

            ),



            eq(

              catalogCategories.appliesTo,

              "both"

            )

          )

        )

      )

      .limit(

        1

      );



  return rows[0];

}



async function getSubcategory({

  rawId,

  categoryId,

}: {

  rawId: string;

  categoryId: number;

}) {

  if (!rawId) {

    return null;

  }



  const id =

    Number.parseInt(

      rawId,

      10

    );



  if (

    !Number.isInteger(

      id

    ) ||

    id <= 0

  ) {

    return undefined;

  }



  const rows =

    await db

      .select({

        id:

          catalogSubcategories.id,



        categoryId:

          catalogSubcategories.categoryId,



        isVisible:

          catalogSubcategories.isVisible,

      })

      .from(

        catalogSubcategories

      )

      .where(

        and(

          eq(

            catalogSubcategories.id,

            id

          ),



          eq(

            catalogSubcategories.categoryId,

            categoryId

          )

        )

      )

      .limit(

        1

      );



  return rows[0];

}



function parseCommonProductFields(

  formData: FormData

) {

  const name =

    getText(

      formData,

      "name"

    );



  const category =

    getText(

      formData,

      "category"

    );



  const subcategoryIdRaw =

    getText(

      formData,

      "subcategoryId"

    );



  const tag =

    getText(

      formData,

      "tag"

    );



  const priceRaw =

    getText(

      formData,

      "price"

    );



  const price =

    priceRaw ===

    ""

      ? null

      : Number(

          priceRaw

        );



  const description =

    getText(

      formData,

      "description"

    );



  const specs =

    getText(

      formData,

      "specs"

    )

      .split(

        "\n"

      )

      .map(

        (

          spec

        ) =>

          spec.trim()

      )

      .filter(

        Boolean

      );



  const sortOrderRaw =

    getText(

      formData,

      "sortOrder"

    ) ||

    "0";



  const sortOrder =

    Number.parseInt(

      sortOrderRaw,

      10

    );



  const imageUrl =

    getText(

      formData,

      "imageUrl"

    );



  const possibleImageFile =

    formData.get(

      "imageFile"

    );



  const imageFile =

    possibleImageFile instanceof

    File

      ? possibleImageFile

      : null;



  const hasImageFile =

    imageFile !==

      null &&

    imageFile.size >

      0;



  const isVisible =

    formData.get(

      "isVisible"

    ) === "on";



  return {

    name,

    category,

    subcategoryIdRaw,

    tag,

    price,

    description,

    specs,

    sortOrder,

    imageUrl,

    imageFile,

    hasImageFile,

    isVisible,

  };

}



function validateBasicFields(

  fields: ReturnType<

    typeof parseCommonProductFields

  >,



  fail: (

    message: string

  ) => never

) {

  if (

    !fields.name

  ) {

    fail(

      "Product name is required."

    );

  }



  if (

    !fields.category

  ) {

    fail(

      "Category is required."

    );

  }



  if (

    !fields.description

  ) {

    fail(

      "Description is required."

    );

  }



  if (

    fields.name.length >

    255

  ) {

    fail(

      "Product name is too long."

    );

  }



  if (

    fields.category.length >

    120

  ) {

    fail(

      "Category is too long."

    );

  }



  if (

    fields.tag.length >

    120

  ) {

    fail(

      "Product tag is too long."

    );

  }



  if (

    fields.price !==

      null &&

    (

      !Number.isSafeInteger(

        fields.price

      ) ||

      fields.price <

        0

    )

  ) {

    fail(

      "Price must be a whole number of 0 or greater, or left blank."

    );

  }



  if (

    fields.imageUrl.length >

    1000

  ) {

    fail(

      "Image URL is too long."

    );

  }



  if (

    fields.imageUrl &&

    !isValidImageUrl(

      fields.imageUrl

    )

  ) {

    fail(

      "Please enter a valid image URL."

    );

  }



  if (

    fields.specs.length ===

    0

  ) {

    fail(

      "Add at least one specification."

    );

  }



  if (

    !Number.isInteger(

      fields.sortOrder

    ) ||

    fields.sortOrder <

      0

  ) {

    fail(

      "Display order must be 0 or greater."

    );

  }

}



function refreshProductPages(

  productId?: string

) {

  revalidatePath(

    "/admin/products"

  );



  revalidatePath(

    "/admin/products/new"

  );



  revalidatePath(

    "/admin/categories"

  );



  revalidatePath(

    "/admin/pc-builder"

  );



  revalidatePath(

    "/build-your-rig"

  );



  revalidatePath(

    "/"

  );



  revalidatePath(

    "/category/[slug]",

    "page"

  );



  if (

    productId

  ) {

    revalidatePath(

      `/admin/products/${productId}/edit`

    );



    revalidatePath(

      `/product/${productId}`

    );

  }

}



/* =========================================================

   CREATE

   ========================================================= */



export async function createProduct(

  formData: FormData

) {

  await requireAdmin();



  const fields =

    parseCommonProductFields(

      formData

    );



  const fail = (

    message: string

  ): never =>

    redirectNewProductError(

      message

    );



  validateBasicFields(

    fields,

    fail

  );



  const selectedCategory =

    await getProductCategory(

      fields.category

    );



  if (

    !selectedCategory ||

    !selectedCategory.isVisible

  ) {

    fail(

      "Selected category is not available for products."

    );

  }



  const selectedSubcategory =

    await getSubcategory({

      rawId:

        fields.subcategoryIdRaw,



      categoryId:

        selectedCategory.id,

    });



  if (

    fields.subcategoryIdRaw &&

    !selectedSubcategory

  ) {

    fail(

      "Selected subcategory does not belong to this category."

    );

  }



  if (

    selectedSubcategory &&

    !selectedSubcategory.isVisible

  ) {

    fail(

      "Selected subcategory is currently hidden."

    );

  }



  if (

    !fields.hasImageFile &&

    !fields.imageUrl

  ) {

    fail(

      "Please upload an image or enter an image URL."

    );

  }



  let finalImageUrl =

    fields.imageUrl;



  if (

    fields.hasImageFile &&

    fields.imageFile

  ) {

    try {

      finalImageUrl =

        await uploadProductImage(

          fields.imageFile

        );

    } catch (

      error

    ) {

      fail(

        error instanceof

          Error

          ? error.message

          : "Image upload failed."

      );

    }

  }



  if (

    !finalImageUrl

  ) {

    fail(

      "Product image could not be processed."

    );

  }



  let images: string[];



  try {

    images =

      await resolveGalleryImages(

        formData,

        finalImageUrl,

        [],

        uploadProductImage

      );

  } catch (

    error

  ) {

    fail(

      error instanceof

        Error

        ? error.message

        : "Gallery upload failed."

    );

  }



  const id =

    makeProductId(

      fields.name

    );



  await db.transaction(

    async (tx) => {

      await tx

        .insert(

          products

        )

        .values({

          id,



          name:

            fields.name,



          category:

            fields.category,



          tag:

            fields.tag ||

            "FEATURED",



          price:

            fields.price,



          description:

            fields.description,



          specs:

            fields.specs,



          image:

            finalImageUrl,



          images,



          isVisible:

            fields.isVisible,



          sortOrder:

            fields.sortOrder,

        });



      if (

        selectedSubcategory

      ) {

        await tx

          .insert(

            productSubcategoryAssignments

          )

          .values({

            productId:

              id,



            subcategoryId:

              selectedSubcategory.id,

          });

      }

    }

  );



  refreshProductPages(

    id

  );



  redirect(

    "/admin/products"

  );

}



/* =========================================================

   UPDATE

   ========================================================= */



export async function updateProduct(

  formData: FormData

) {

  await requireAdmin();



  const productId =

    getText(

      formData,

      "productId"

    );



  if (

    !productId

  ) {

    redirect(

      "/admin/products"

    );

  }



  const existingRows =

    await db

      .select()

      .from(

        products

      )

      .where(

        eq(

          products.id,

          productId

        )

      )

      .limit(

        1

      );



  const existingProduct =

    existingRows[0];



  if (

    !existingProduct

  ) {

    redirect(

      "/admin/products"

    );

  }



  const currentAssignmentRows =

    await db

      .select()

      .from(

        productSubcategoryAssignments

      )

      .where(

        eq(

          productSubcategoryAssignments.productId,

          productId

        )

      )

      .limit(

        1

      );



  const currentAssignment =

    currentAssignmentRows[0];



  const fields =

    parseCommonProductFields(

      formData

    );



  const fail = (

    message: string

  ): never =>

    redirectEditProductError(

      productId,

      message

    );



  validateBasicFields(

    fields,

    fail

  );



  const selectedCategory =

    await getProductCategory(

      fields.category

    );



  if (

    !selectedCategory ||

    (

      !selectedCategory.isVisible &&

      fields.category !==

        existingProduct.category

    )

  ) {

    fail(

      "Selected category is not available for products."

    );

  }



  const selectedSubcategory =

    await getSubcategory({

      rawId:

        fields.subcategoryIdRaw,



      categoryId:

        selectedCategory.id,

    });



  if (

    fields.subcategoryIdRaw &&

    !selectedSubcategory

  ) {

    fail(

      "Selected subcategory does not belong to this category."

    );

  }



  if (

    selectedSubcategory &&

    !selectedSubcategory.isVisible &&

    selectedSubcategory.id !==

      currentAssignment

        ?.subcategoryId

  ) {

    fail(

      "Selected subcategory is currently hidden."

    );

  }



  let finalImageUrl =

    existingProduct.image;



  if (

    fields.imageUrl

  ) {

    finalImageUrl =

      fields.imageUrl;

  }



  if (

    fields.hasImageFile &&

    fields.imageFile

  ) {

    try {

      finalImageUrl =

        await uploadProductImage(

          fields.imageFile

        );

    } catch (

      error

    ) {

      fail(

        error instanceof

          Error

          ? error.message

          : "Image upload failed."

      );

    }

  }



  let images: string[];



  try {

    images =

      await resolveGalleryImages(

        formData,

        finalImageUrl,

        (

          existingProduct.images ??

          []

        ).filter(

          (url) =>

            url !==

              existingProduct.image

        ),

        uploadProductImage

      );

  } catch (

    error

  ) {

    fail(

      error instanceof

        Error

        ? error.message

        : "Gallery upload failed."

    );

  }



  await db.transaction(

    async (tx) => {

      await tx

        .update(

          products

        )

        .set({

          name:

            fields.name,



          category:

            fields.category,



          tag:

            fields.tag ||

            "FEATURED",



          price:

            fields.price,



          description:

            fields.description,



          specs:

            fields.specs,



          image:

            finalImageUrl,



          images,



          isVisible:

            fields.isVisible,



          sortOrder:

            fields.sortOrder,



          updatedAt:

            new Date(),

        })

        .where(

          eq(

            products.id,

            productId

          )

        );



      await tx

        .delete(

          productSubcategoryAssignments

        )

        .where(

          eq(

            productSubcategoryAssignments.productId,

            productId

          )

        );



      if (

        selectedSubcategory

      ) {

        await tx

          .insert(

            productSubcategoryAssignments

          )

          .values({

            productId,



            subcategoryId:

              selectedSubcategory.id,

          });

      }

    }

  );



  refreshProductPages(

    productId

  );



  redirect(

    "/admin/products"

  );

}



/* =========================================================

   VISIBILITY

   ========================================================= */



export async function toggleProductVisibility(

  formData: FormData

) {

  await requireAdmin();



  const productId =

    getText(

      formData,

      "productId"

    );



  if (

    !productId

  ) {

    redirect(

      "/admin/products"

    );

  }



  const rows =

    await db

      .select({

        isVisible:

          products.isVisible,

      })

      .from(

        products

      )

      .where(

        eq(

          products.id,

          productId

        )

      )

      .limit(

        1

      );



  const product =

    rows[0];



  if (

    !product

  ) {

    redirect(

      "/admin/products"

    );

  }



  await db

    .update(

      products

    )

    .set({

      isVisible:

        !product.isVisible,



      updatedAt:

        new Date(),

    })

    .where(

      eq(

        products.id,

        productId

      )

    );



  refreshProductPages(

    productId

  );



  redirect(

    "/admin/products"

  );

}



/* =========================================================

   DELETE

   ========================================================= */



export async function deleteProduct(

  formData: FormData

) {

  await requireAdmin();



  const productId =

    getText(

      formData,

      "productId"

    );



  if (

    !productId

  ) {

    redirect(

      "/admin/products"

    );

  }



  await db

    .delete(

      products

    )

    .where(

      eq(

        products.id,

        productId

      )

    );



  refreshProductPages(

    productId

  );



  redirect(

    "/admin/products"

  );

}