import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronRight,
  Package,
  SlidersHorizontal,
  ZoomIn,
  FileText,
} from "lucide-react";
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
      <main id="page-top" className="min-h-screen bg-white pt-16 md:pt-20">
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
          <div className="grid items-stretch gap-6 lg:grid-cols-2 lg:gap-10">
            <section aria-label={`${item.name} photos`} className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-shadow duration-300 hover:border-slate-300 hover:shadow-md sm:p-4">
              <div className="relative h-[320px] overflow-hidden rounded-xl border border-slate-200 bg-[#f8fafc] shadow-[inset_0_1px_8px_rgba(15,23,42,0.03)] sm:h-[420px] lg:h-auto lg:min-h-[420px] lg:flex-1 [&>div]:bg-[#f8fafc] [&>div]:h-full lg:[&>div]:absolute lg:[&>div]:inset-0 [&_img]:object-center">
                <PhotoGallery key={item.id} images={galleryImages(item.image, item.images)} title={item.name} />
                {item.badge && (
                  <span className="pointer-events-none absolute left-3 top-3 z-20 rounded-full border border-brand/20 bg-white/95 px-3 py-1.5 font-sans text-[10px] font-bold uppercase tracking-wide text-brand shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <p className="mt-3 flex shrink-0 items-center justify-center gap-1.5 text-center font-sans text-[11px] text-slate-500">
                <ZoomIn aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                Tap an image to zoom · Browse thumbnails for more views
              </p>
            </section>
            <section className="flex min-w-0 flex-col rounded-2xl border border-slate-200 border-t-4 border-t-brand bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <Link href={item.categoryHref} className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 font-sans text-[11px] font-semibold text-slate-600 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                  {item.categoryName}<ArrowUpRight aria-hidden="true" className="ml-1.5 h-3 w-3" />
                </Link>
              </div>
              <h1 className="mt-3 break-words font-sans text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl">{item.name}</h1>
              {item.secondaryLabel && <p className="mt-2 font-sans text-sm text-slate-500">{item.secondaryLabel}</p>}
              <p className="mt-5 inline-flex max-w-full self-start items-center rounded-xl bg-brand px-5 py-3 font-sans text-2xl font-extrabold leading-tight text-white tabular-nums">
                {formatPrice(item.price)}
              </p>
              <p className="mt-2 font-sans text-xs leading-5 text-slate-500">
                {item.kind === "build"
                  ? "Starting price. Contact GameX for configuration and availability."
                  : "Contact GameX to confirm current availability."}
              </p>
              <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
                <h2 className="flex items-center gap-2 font-sans text-sm font-bold text-slate-900">
                  <FileText aria-hidden="true" className="h-4 w-4 text-brand" />
                  {item.kind === "build" ? "About this rig" : "Product description"}
                </h2>
                <p className="mt-2 whitespace-pre-line break-words font-sans text-sm leading-7 text-slate-600">{item.description}</p>
              </div>
              <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row">
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 font-sans text-sm font-bold tracking-normal text-white shadow-sm hover:bg-[#20bd5a]">
                  <FaWhatsapp className="h-5 w-5 shrink-0" />Chat on WhatsApp
                </a>
                <Link href={item.categoryHref} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 font-sans text-xs font-semibold text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                  <ArrowLeft className="h-4 w-4" />{item.kind === "build" ? "More rigs" : "Browse category"}
                </Link>
              </div>
            </section>
          </div>
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-brand">{item.kind === "build" ? "Configuration" : "Technical details"}</p>
            <h2 className="mt-1 flex items-center gap-2 font-sans text-lg font-bold text-slate-900">
              <SlidersHorizontal aria-hidden="true" className="h-4 w-4 text-brand" />Specifications
            </h2>
            {item.specs.length ? (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {item.specs.map((spec, index) => (
                  <li key={`${item.id}-${index}`} className="flex min-w-0 items-start gap-2 rounded-xl border border-slate-100 border-l-2 border-l-brand bg-white px-3 py-3 font-sans text-sm leading-6 text-slate-600">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-brand" />
                    <span className="min-w-0 break-words">{spec}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="mt-3 font-sans text-sm text-slate-500">Contact GameX for the full specifications.</p>}
          </section>
          {related.length > 0 && (
            <section className="mt-10" aria-labelledby="related-items-title">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-brand">Keep exploring</p>
                  <h2 id="related-items-title" className="mt-1 border-l-4 border-brand pl-3 font-sans text-xl font-bold text-slate-900">
                    {item.kind === "build" ? "Similar rigs" : "Similar products & more"}
                  </h2>
                </div>
                <Link href={item.kind === "build" ? "/#builds" : "/#products"} className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-sans text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900">
                  View catalogue<ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {related.map((entry) => (
                  <article key={entry.id} className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                    <Link href={entry.href} aria-label={`View ${entry.name}`} className="grid aspect-[4/3] place-items-center overflow-hidden border-b border-slate-100 bg-[#f8fafc] p-3 focus-visible:outline-2 focus-visible:outline-brand">
                      {entry.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={entry.image} alt={entry.name} loading="lazy" className="h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-[1.03]" />
                      ) : <Package className="h-10 w-10 text-slate-300" />}
                    </Link>
                    <div className="flex flex-1 flex-col p-3">
                      <p className="font-sans text-[10px] font-semibold text-brand">{entry.label}</p>
                      <h3 className="mt-1 break-words font-sans text-sm font-bold leading-5 text-slate-900">
                        <Link href={entry.href} className="hover:text-brand focus-visible:outline-2 focus-visible:outline-brand">{entry.name}</Link>
                      </h3>
                      <div className="mt-auto space-y-2 pt-3">
                        <p className="flex min-h-10 items-center rounded-lg bg-brand px-3 py-2 font-sans text-sm font-bold leading-5 text-white">
                          <span className="min-w-0 break-words">{formatPrice(entry.price)}</span>
                        </p>
                        <Link href={entry.href} aria-label={`View details for ${entry.name}`} className="flex min-h-10 items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 font-sans text-xs font-semibold text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                          View Details<ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
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