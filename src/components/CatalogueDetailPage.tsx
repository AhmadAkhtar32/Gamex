import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, ChevronRight, Package } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PhotoGallery } from "@/components/PhotoGallery";
import { getSiteChrome } from "@/lib/site-chrome";
import { galleryImages } from "@/lib/gallery";
import { formatPrice } from "@/lib/price";
import { createWhatsAppUrl } from "@/lib/whatsapp";
export type CatalogueDetailItem = {
  id: string;
  kind: "product" | "build";
  name: string;
  price: number | null;
  description: string;
  specs: string[];
  image: string;
  images?: string[];
  badge: string;
  categoryName: string;
  categoryHref: string;
  secondaryLabel?: string;
};
export type RelatedCatalogueItem = {
  id: string;
  name: string;
  price: number | null;
  image: string;
  label: string;
  href: string;
};
export async function CatalogueDetailPage({ item, related }: {
  item: CatalogueDetailItem;
  related: RelatedCatalogueItem[];
}) {
  const chrome = await getSiteChrome();
  const href = `/${item.kind}/${encodeURIComponent(item.id)}`;
  const whatsapp = createWhatsAppUrl(
    `Hi GameX, I would like to inquire about ${item.name}.\nPrice: ${formatPrice(item.price)}\nhttps://gamex.pk${href}`
  );
  return (
    <>
      <Navbar settings={chrome.navbar} links={chrome.navLinks} />
      <main id="page-top" className="min-h-screen bg-[#fff8f8] pt-16 md:pt-20">
        <div className="border-b border-brand/10 bg-white">
          <nav aria-label="Breadcrumb" className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-5 py-4 font-sans text-xs text-slate-500 md:px-8">
            <Link href="/" className="hover:text-brand">Home</Link>
            <ChevronRight aria-hidden="true" className="h-3 w-3" />
            <Link href={item.categoryHref} className="hover:text-brand">{item.categoryName}</Link>
            <ChevronRight aria-hidden="true" className="h-3 w-3" />
            <span aria-current="page" className="break-words font-semibold text-brand">{item.name}</span>
          </nav>
        </div>
        <div className="mx-auto max-w-7xl px-5 py-6 md:px-8 md:py-10">
          <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-10">
            <section aria-label={`${item.name} photos`} className="min-w-0 overflow-hidden rounded-2xl border border-brand/10 bg-white p-3 shadow-sm sm:p-4">
              <div className="lg:h-[460px]">
                <PhotoGallery key={item.id} images={galleryImages(item.image, item.images)} title={item.name} />
              </div>
              <p className="mt-2 text-center font-sans text-[11px] text-slate-400">
                Tap an image to zoom · Browse the thumbnails for more views
              </p>
            </section>
            <section className="min-w-0 rounded-2xl border border-brand/10 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <Link href={item.categoryHref} className="font-sans text-xs font-semibold text-brand">{item.categoryName}</Link>
                {item.badge && (
                  <span className="rounded-full border border-brand/15 bg-red-50 px-2.5 py-1 font-sans text-[10px] font-semibold text-brand">{item.badge}</span>
                )}
              </div>
              <h1 className="mt-3 break-words font-display text-2xl font-extrabold leading-snug text-brand-deep sm:text-3xl">{item.name}</h1>
              {item.secondaryLabel && <p className="mt-2 font-sans text-sm text-slate-500">{item.secondaryLabel}</p>}
              <p className="mt-5 inline-flex max-w-full rounded-xl bg-brand px-4 py-2.5 font-sans text-2xl font-bold text-white tabular-nums">{formatPrice(item.price)}</p>
              <p className="mt-2 font-sans text-xs leading-5 text-slate-500">
                {item.kind === "build"
                  ? "Starting price. Contact GameX for configuration and availability."
                  : "Contact GameX to confirm current availability."}
              </p>
              <div className="mt-5 border-t border-slate-100 pt-5">
                <h2 className="font-sans text-sm font-bold text-slate-900">{item.kind === "build" ? "About this rig" : "Product description"}</h2>
                <p className="mt-2 whitespace-pre-line break-words font-sans text-sm leading-7 text-slate-600">{item.description}</p>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 font-sans text-sm font-bold tracking-normal text-white shadow-sm hover:bg-[#20bd5a]">
                  <FaWhatsapp className="h-5 w-5 shrink-0" />Chat on WhatsApp
                </a>
                <Link href={item.categoryHref} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-brand/15 px-4 py-3 font-sans text-xs font-semibold text-brand">
                  <ArrowLeft className="h-4 w-4" />{item.kind === "build" ? "More rigs" : "Browse category"}
                </Link>
              </div>
            </section>
          </div>
          <section className="mt-6 rounded-2xl border border-brand/10 bg-white p-5 sm:p-7">
            <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-brand">{item.kind === "build" ? "Configuration" : "Technical details"}</p>
            <h2 className="mt-1 font-sans text-lg font-bold text-slate-900">Specifications</h2>
            {item.specs.length ? (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {item.specs.map((spec, index) => (
                  <li key={`${item.id}-${index}`} className="flex min-w-0 items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 font-sans text-sm leading-6 text-slate-600">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-brand" />
                    <span className="min-w-0 break-words">{spec}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="mt-3 font-sans text-sm text-slate-500">Contact GameX for the full specifications.</p>}
          </section>
          {related.length > 0 && (
            <section className="mt-10" aria-labelledby="related-items-title">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-brand">Keep exploring</p>
                  <h2 id="related-items-title" className="mt-1 font-sans text-xl font-bold text-slate-900">{item.kind === "build" ? "Similar rigs" : "Similar products & more"}</h2>
                </div>
                <Link href={item.kind === "build" ? "/#builds" : "/#products"} className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-brand">
                  View catalogue<ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {related.map((entry) => (
                  <Link key={entry.id} href={entry.href} className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-brand">
                    <div className="grid aspect-square place-items-center bg-slate-50 p-3">
                      {entry.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={entry.image} alt={entry.name} loading="lazy" className="h-full w-full object-contain" />
                      ) : <Package className="h-10 w-10 text-slate-300" />}
                    </div>
                    <div className="flex flex-1 flex-col p-3">
                      <p className="font-sans text-[10px] font-semibold text-brand">{entry.label}</p>
                      <h3 className="mt-1 break-words font-sans text-sm font-bold leading-5 text-slate-900">{entry.name}</h3>
                      <p className="mt-auto break-words pt-3 font-sans text-sm font-bold text-brand">{formatPrice(entry.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
          <section className="mt-8 rounded-2xl border border-brand/10 bg-white p-5 sm:p-7">
            <h2 className="font-sans text-lg font-bold text-slate-900">
              {item.kind === "build" ? `${item.name} Gaming PC Build in Pakistan` : `Buy ${item.name} in Pakistan`}
            </h2>
            <p className="mt-3 font-sans text-sm leading-7 text-slate-600">
              Review the full specifications and {item.kind === "build" ? "starting price" : "price"} of {item.name},
              then contact GameX for current availability, {item.kind === "build" ? "component options and customization" : "purchase information"}.
              Browse more <Link href={item.categoryHref} className="font-semibold text-brand hover:underline">{item.categoryName}</Link> from GameX Pakistan.
            </p>
          </section>
        </div>
      </main>
      <Footer content={chrome.footer} links={chrome.footerLinks} socialLinks={chrome.footerSocialLinks} />
    </>
  );
}