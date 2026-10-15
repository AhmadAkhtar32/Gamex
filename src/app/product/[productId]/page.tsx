import { cache } from "react";
import type { Metadata } from "next";
import { and, eq } from "drizzle-orm";
import { notFound, permanentRedirect } from "next/navigation";
import { db } from "@/db";
import { catalogCategories, products } from "@/db/schema";
import { CatalogueDetailPage } from "@/components/CatalogueDetailPage";
import { createProductPaths } from "@/lib/product-paths";
import { relatedCatalogue } from "@/lib/catalogue-order";
import { galleryImages } from "@/lib/gallery";

const SITE_URL = "https://gamex.pk";
export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{
    productId: string;
  }>;
};

const getProductDirectory = cache(async () =>
  db.select({
    id: products.id,
    name: products.name,
  })
    .from(products)
    .where(eq(products.isVisible, true))
);

const getProduct = cache(async (productId: string) => {
  const directory = await getProductDirectory();
  const paths = createProductPaths(directory);
  const selected = directory.find((entry) => entry.id === productId)
    ?? directory.find(
      (entry) =>
        paths.get(entry.id) === `/product/${encodeURIComponent(productId)}`
    );
  if (!selected) return null;
  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      category: products.category,
      tag: products.tag,
      price: products.price,
      description: products.description,
      specs: products.specs,
      image: products.image,
      images: products.images,
      updatedAt: products.updatedAt,
      categoryName: catalogCategories.name,
      categorySlug: catalogCategories.slug,
    })
    .from(products)
    .leftJoin(
      catalogCategories,
      eq(products.category, catalogCategories.slug)
    )
    .where(
      and(
        eq(products.id, selected.id),
        eq(products.isVisible, true)
      )
    )
    .limit(1);
  return rows[0] ?? null;
});

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { productId } = await params;
  const product = await getProduct(productId);
  if (!product) {
    return {
      title: "Product Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
  const categoryName = product.categoryName ?? "Gaming Hardware";
  const title = `${product.name} Price in Pakistan`;
  const description = `${product.name} at GameX Pakistan. Check price, specifications and details for this ${categoryName.toLowerCase()} product and contact GameX for availability.`;
  const canonical = createProductPaths(
    await getProductDirectory()
  ).get(product.id)!;
  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      locale: "en_PK",
      url: `${SITE_URL}${canonical}`,
      siteName: "GameX Pakistan",
      title: `${product.name} Price in Pakistan | GameX`,
      description,
      images: [
        {
          url: product.image,
          alt: `${product.name} at GameX Pakistan`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} Price in Pakistan | GameX`,
      description,
      images: [product.image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
  };
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { productId } = await params;
  const product = await getProduct(productId);
  if (!product) {
    notFound();
  }
  const categoryName = product.categoryName ?? product.category;
  const categoryUrl = product.categorySlug
    ? `/category/${product.categorySlug}`
    : "/#products";
  const paths = createProductPaths(await getProductDirectory());
  const canonicalPath = paths.get(product.id)!;
  if (`/product/${encodeURIComponent(productId)}` !== canonicalPath) {
    permanentRedirect(canonicalPath);
  }
  const productUrl = `${SITE_URL}${canonicalPath}`;
  const productStructuredData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: product.name,
    url: productUrl,
    image: galleryImages(product.image, product.images),
    description: product.description,
    sku: product.id,
    category: categoryName,
  };
  if (product.price !== null) {
    productStructuredData.offers = {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "PKR",
      price: String(product.price),
      seller: {
        "@type": "Organization",
        name: "GameX",
        url: SITE_URL,
      },
    };
  }
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryName,
        item: product.categorySlug
          ? `${SITE_URL}/category/${product.categorySlug}`
          : `${SITE_URL}/#products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: productUrl,
      },
    ],
  };
  const candidates = await db
    .select()
    .from(products)
    .where(eq(products.isVisible, true));
  const recommendations = relatedCatalogue(candidates, product);
  const categoryRows = await db
    .select({
      slug: catalogCategories.slug,
      name: catalogCategories.name,
    })
    .from(catalogCategories)
    .where(eq(catalogCategories.isVisible, true));
  const categoryNames = new Map(
    categoryRows.map((row) => [row.slug, row.name])
  );
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productStructuredData)
            .replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData)
            .replace(/</g, "\\u003c"),
        }}
      />
      <CatalogueDetailPage
        item={{
          id: product.id,
          kind: "product",
          name: product.name,
          price: product.price,
          description: product.description,
          specs: product.specs,
          image: product.image,
          images: product.images,
          badge: product.tag,
          categoryName,
          categoryHref: categoryUrl,
        }}
        related={recommendations.map((entry) => ({
          id: entry.id,
          name: entry.name,
          price: entry.price,
          image: entry.image,
          label: categoryNames.get(entry.category) ?? entry.category,
          href: paths.get(entry.id)!,
        }))}
      />
    </>
  );
}