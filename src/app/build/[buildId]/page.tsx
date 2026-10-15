import { cache } from "react";
import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { notFound, permanentRedirect } from "next/navigation";
import { db } from "@/db";
import { customBuilds } from "@/db/schema";
import { CatalogueDetailPage } from "@/components/CatalogueDetailPage";
import { createBuildPaths } from "@/lib/build-paths";
import { relatedCatalogue } from "@/lib/catalogue-order";
import { galleryImages } from "@/lib/gallery";

const SITE_URL = "https://gamex.pk";
export const dynamic = "force-dynamic";

type BuildPageProps = {
  params: Promise<{
    buildId: string;
  }>;
};

const getBuilds = cache(async () =>
  db.select()
    .from(customBuilds)
    .where(eq(customBuilds.isVisible, true))
);

const getBuild = cache(async (buildId: string) => {
  const builds = await getBuilds();
  const paths = createBuildPaths(builds);
  return builds.find((build) => build.id === buildId)
    ?? builds.find(
      (build) =>
        paths.get(build.id) === `/build/${encodeURIComponent(buildId)}`
    )
    ?? null;
});

export async function generateMetadata({
  params,
}: BuildPageProps): Promise<Metadata> {
  const { buildId } = await params;
  const build = await getBuild(buildId);
  if (!build) {
    return {
      title: "Gaming PC Build Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
  const title = `${build.name} Gaming PC Build Price in Pakistan`;
  const description = `${build.name} custom gaming PC build from GameX Pakistan. Check price, specifications and configuration details for this ${build.role.toLowerCase()} gaming system.`;
  const canonical = createBuildPaths(await getBuilds()).get(build.id)!;
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
      title: `${title} | GameX Pakistan`,
      description,
      images: [
        {
          url: build.image,
          alt: `${build.name} custom gaming PC build at GameX Pakistan`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | GameX Pakistan`,
      description,
      images: [build.image],
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

export default async function BuildPage({ params }: BuildPageProps) {
  const { buildId } = await params;
  const build = await getBuild(buildId);
  if (!build) {
    notFound();
  }
  const candidates = await getBuilds();
  const paths = createBuildPaths(candidates);
  const canonicalPath = paths.get(build.id)!;
  if (`/build/${encodeURIComponent(buildId)}` !== canonicalPath) {
    permanentRedirect(canonicalPath);
  }
  const buildUrl = `${SITE_URL}${canonicalPath}`;
  const productStructuredData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${buildUrl}#product`,
    name: build.name,
    url: buildUrl,
    image: galleryImages(build.image, build.images),
    description: build.description,
    sku: build.id,
    category: "Custom Gaming PC",
    brand: {
      "@type": "Brand",
      name: "GameX",
    },
  };
  if (build.price !== null) {
    productStructuredData.offers = {
      "@type": "Offer",
      url: buildUrl,
      priceCurrency: "PKR",
      price: String(build.price),
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
        name: "Custom Builds",
        item: `${SITE_URL}/#builds`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: build.name,
        item: buildUrl,
      },
    ],
  };
  const recommendations = relatedCatalogue(candidates, build);
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
          id: build.id,
          kind: "build",
          name: build.name,
          price: build.price,
          description: build.description,
          specs: build.specs,
          image: build.image,
          images: build.images,
          badge: build.badge,
          categoryName: "Custom Builds",
          categoryHref: "/#builds",
          secondaryLabel: build.role,
        }}
        related={recommendations.map((entry) => ({
          id: entry.id,
          name: entry.name,
          price: entry.price,
          image: entry.image,
          label: entry.role || "Custom Build",
          href: paths.get(entry.id)!,
        }))}
      />
    </>
  );
}