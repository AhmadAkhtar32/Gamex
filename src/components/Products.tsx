"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronUp,
  Images,
  Package,
  SlidersHorizontal,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { DetailsModal } from "@/components/DetailsModal";
import { formatPrice } from "@/lib/price";
import { createWhatsAppUrl } from "@/lib/whatsapp";

export type PublicCategory = {
  id: string;
  label: string;
};

export type PublicSubcategory = {
  id: number;
  category: string;
  label: string;
};

export type PublicProduct = {
  id: string;
  name: string;
  category: string;
  tag: string;
  price: number | null;
  description: string;
  specs: string[];
  // Keep the primary image for backwards compatibility.
  image: string;
  images?: string[];
  subcategoryIds?: number[];
};

function getProductImages(product: PublicProduct) {
  return Array.from(new Set(
    [product.image, ...(product.images ?? [])]
      .map((value) => value?.trim())
      .filter((value): value is string => Boolean(value))
  ));
}

function getProductLimit(hasSidebar = false) {
  if (typeof window === "undefined") return hasSidebar ? 8 : 10;
  if (window.innerWidth >= 1280) return hasSidebar ? 8 : 10;
  if (window.innerWidth >= 1024) return hasSidebar ? 4 : 6;
  if (window.innerWidth >= 640) return 4;
  return 2;
}

function getCondition(tag: string): "new" | "used" | "other" {
  const normalized = tag.trim().toLowerCase();
  if (normalized === "new") return "new";
  if (normalized === "used") return "used";
  return "other";
}

export default function Products({
  products,
  categories,
  subcategories = [],
  categoryPage = false,
  initialCategory = "all",
}: {
  products: PublicProduct[];
  categories: PublicCategory[];
  subcategories?: PublicSubcategory[];
  categoryPage?: boolean;
  initialCategory?: string;
}) {
  const [active, setActive] = useState(initialCategory);
  const [selectedProduct, setSelectedProduct] = useState<PublicProduct | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [initialLimit, setInitialLimit] = useState(10);
  const [subcategoryFilter, setSubcategoryFilter] = useState("");
  const [minimumPrice, setMinimumPrice] = useState<number | null>(null);
  const [maximumPrice, setMaximumPrice] = useState<number | null>(null);
  const [priceSort, setPriceSort] = useState("featured");
  const [conditionFilter, setConditionFilter] = useState("all");

  const hasSidebar = active !== "all";

  useEffect(() => {
    const updateLimit = () => setInitialLimit(getProductLimit(hasSidebar));
    updateLimit();
    window.addEventListener("resize", updateLimit);
    return () => window.removeEventListener("resize", updateLimit);
  }, [hasSidebar]);

  useEffect(() => {
    if (active === "all") return;
    if (!categories.some((category) => category.id === active)) {
      setActive("all");
      setShowAll(false);
      setSubcategoryFilter("");
      setMinimumPrice(null);
      setMaximumPrice(null);
      setPriceSort("featured");
      setConditionFilter("all");
    }
  }, [active, categories]);

  const categoryProducts = active === "all"
    ? products
    : products.filter((product) => product.category === active);

  const prices = categoryProducts
    .map((product) => product.price)
    .filter((price): price is number => typeof price === "number" && Number.isFinite(price));

  const priceFloor = prices.length ? Math.min(...prices) : 0;
  const priceCeiling = prices.length ? Math.max(...prices) : 0;
  const selectedMinimum = Math.min(priceCeiling, Math.max(priceFloor, minimumPrice ?? priceFloor));
  const selectedMaximum = Math.max(selectedMinimum, Math.min(priceCeiling, maximumPrice ?? priceCeiling));
  const priceRangeActive = selectedMinimum > priceFloor || selectedMaximum < priceCeiling;
  const availableSubcategories = subcategories.filter((subcategory) => subcategory.category === active);
  const subcategoryHint = availableSubcategories.slice(0, 2).map((subcategory) => subcategory.label).join(" / ");
  const filtersActive = Boolean(subcategoryFilter || priceRangeActive || priceSort !== "featured" || conditionFilter !== "all");
  const activeLabel = categories.find((category) => category.id === active)?.label ?? active;

  const filteredProducts = categoryProducts.filter((product) => {
    if (subcategoryFilter && !product.subcategoryIds?.includes(Number(subcategoryFilter))) return false;
    if (categoryPage && conditionFilter !== "all" && getCondition(product.tag) !== conditionFilter) return false;
    if (priceRangeActive && (product.price === null || product.price < selectedMinimum || product.price > selectedMaximum)) return false;
    return true;
  });

  if (priceSort !== "featured") {
    filteredProducts.sort((left, right) => {
      if (left.price === null && right.price !== null) return 1;
      if (left.price !== null && right.price === null) return -1;
      const difference = (left.price ?? 0) - (right.price ?? 0);
      return (priceSort === "high" ? -difference : difference) || left.name.localeCompare(right.name);
    });
  }

  const visibleProducts = showAll ? filteredProducts : filteredProducts.slice(0, initialLimit);
  const canToggle = filteredProducts.length > initialLimit;

  function resetFilters() {
    setSubcategoryFilter("");
    setMinimumPrice(null);
    setMaximumPrice(null);
    setPriceSort("featured");
    setConditionFilter("all");
    setShowAll(false);
  }

  function changeCategory(categoryId: string) {
    setActive(categoryId);
    resetFilters();
  }

  function toggleProducts() {
    if (showAll) {
      setShowAll(false);
      window.setTimeout(() => {
        document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
      return;
    }
    setShowAll(true);
  }

  const inputClass = "min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-sans text-sm text-slate-700 outline-none focus:border-brand focus:ring-2 focus:ring-brand/10";

  return (
    <>
      <section id="products" className="relative overflow-hidden bg-white pb-8 pt-5 md:pb-10 md:pt-6">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(230,0,0,0.06),transparent_29%),radial-gradient(circle_at_88%_80%,rgba(255,42,42,0.045),transparent_31%)]" />
        <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,black,transparent)]" />

        <div className="relative mx-auto max-w-[1480px] px-5 md:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand">
              <span className="h-2 w-2 rounded-full bg-brand shadow-[0_0_10px_rgba(230,0,0,0.45)]" />
              {categoryPage ? activeLabel : "Catalogue"}
            </div>
            <div className="mx-auto mt-4 flex items-center justify-center gap-2">
              <span className="h-[3px] w-10 rounded-full bg-brand" />
              <span className="h-[3px] w-3 rounded-full bg-brand-deep" />
              <span className="h-[3px] w-2 rounded-full bg-brand/40" />
            </div>
          </div>

          {/* Mobile catalogue: categories replace individual product cards. */}
          {!categoryPage && (
            <div className="mt-6 lg:hidden">
              <div className="mb-4 flex items-end justify-between gap-3">
                <h2 className="text-xl font-bold text-brand-deep">Shop by category</h2>
                <span className="font-sans text-xs text-slate-500">Choose your components</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {categories.filter((category) => category.id !== "all").map((category) => {
                  const items = products.filter((product) => product.category === category.id);
                  const representative = items.find((product) => getProductImages(product).length > 0);
                  const image = representative ? getProductImages(representative)[0] : undefined;
                  return (
                    <Link key={category.id} href={`/category/${encodeURIComponent(category.id)}`} className="flex min-w-0 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                      <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-xl bg-slate-50 p-2">
                        {image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={image} alt={category.label} loading="lazy" className="h-full w-full object-contain" />
                        ) : <Package className="h-9 w-9 text-slate-300" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="break-words text-base font-bold text-brand-deep">{category.label}</h3>
                        <p className="mt-1 font-sans text-xs text-slate-500">{items.length} {items.length === 1 ? "product" : "products"}</p>
                        <span className="mt-3 inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-brand">Explore category <ArrowUpRight className="h-3.5 w-3.5" /></span>
                      </div>
                    </Link>
                  );
                })}
              </div>
              {categories.filter((category) => category.id !== "all").length === 0 && (
                <p className="rounded-2xl border border-dashed border-brand/20 bg-red-50 p-6 text-center text-sm text-slate-500">No categories are available yet.</p>
              )}
            </div>
          )}

          {/* Desktop category tabs retain the current catalogue navigation. */}
          {!categoryPage && (
            <div className="mt-5 hidden flex-wrap items-center justify-center gap-2 lg:flex">
              {categories.map((category) => (
                <button key={category.id} type="button" onClick={() => changeCategory(category.id)} aria-pressed={active === category.id} className={`rounded-full border px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${active === category.id ? "border-brand bg-brand text-white shadow-[0_10px_28px_-14px_rgba(230,0,0,0.65)]" : "border-black/10 bg-white text-slate-600 hover:border-brand/40 hover:bg-brand/[0.04] hover:text-brand"}`}>
                  {category.label}
                </button>
              ))}
            </div>
          )}

          <div className={`${categoryPage ? "block" : "hidden lg:block"} mt-6`}>
            {categoryPage && availableSubcategories.length > 0 && (
              <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 font-sans shadow-sm lg:hidden">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <label htmlFor="catalogue-mobile-subcategory" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <SlidersHorizontal className="h-4 w-4 text-brand" /> Filter by subcategory
                  </label>
                  {subcategoryFilter && (
                    <button type="button" onClick={() => { setSubcategoryFilter(""); setShowAll(false); }} className="min-h-11 px-2 text-xs font-semibold text-brand">Clear</button>
                  )}
                </div>
                <div className="relative">
                  <select id="catalogue-mobile-subcategory" value={subcategoryFilter} onChange={(event) => { setSubcategoryFilter(event.target.value); setShowAll(false); }} className={`${inputClass} appearance-none pr-10`}>
                    <option value="">{subcategoryHint}</option>
                    {availableSubcategories.map((subcategory) => <option key={subcategory.id} value={subcategory.id}>{subcategory.label}</option>)}
                  </select>
                  <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </div>
                <p aria-live="polite" className="mt-3 text-xs text-slate-500">{filteredProducts.length} of {categoryProducts.length} products{subcategoryFilter ? "" : " · Showing all subcategories"}</p>
              </div>
            )}
            <div className={hasSidebar ? "grid items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]" : "block"}>
              {hasSidebar && (
                <aside aria-label={`${activeLabel} filters`} className="hidden min-w-0 rounded-2xl border border-slate-200 bg-white p-5 font-sans shadow-sm lg:block">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="inline-flex items-center gap-2 text-sm font-bold text-slate-900"><SlidersHorizontal className="h-4 w-4 text-brand" /> Filters</h2>
                    {filtersActive && <button type="button" onClick={resetFilters} className="text-xs font-semibold text-brand hover:underline">Reset</button>}
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{filteredProducts.length} of {categoryProducts.length} products</p>

                  {availableSubcategories.length > 0 && (
                    <div className="mt-5 border-t border-slate-100 pt-5">
                      <label htmlFor="catalogue-subcategory" className="mb-2 block text-xs font-semibold text-slate-700">Subcategory</label>
                      <select id="catalogue-subcategory" value={subcategoryFilter} onChange={(event) => { setSubcategoryFilter(event.target.value); setShowAll(false); }} className={inputClass}>
                        <option value="">{subcategoryHint}</option>
                        {availableSubcategories.map((subcategory) => <option key={subcategory.id} value={subcategory.id}>{subcategory.label}</option>)}
                      </select>
                      <p className="mt-2 text-[11px] leading-5 text-slate-500">{subcategoryFilter ? "Choose another subcategory or reset to show all." : "Showing all subcategories. Choose one to filter."}</p>
                    </div>
                  )}

                  <div className="mt-5 border-t border-slate-100 pt-5">
                    <h3 className="text-xs font-semibold text-slate-700">Price range</h3>
                    {prices.length > 0 ? (
                      <>
                        <p className="mt-2 break-words text-xs leading-5 text-slate-500">Available: {formatPrice(priceFloor)} – {formatPrice(priceCeiling)}</p>
                        <label htmlFor="catalogue-min-price" className="mt-4 flex justify-between gap-2 text-xs text-slate-600"><span>Minimum</span><span className="font-semibold text-slate-900">{formatPrice(selectedMinimum)}</span></label>
                        <input id="catalogue-min-price" type="range" min={priceFloor} max={priceCeiling} step={1} value={selectedMinimum} disabled={priceFloor === priceCeiling} onChange={(event) => { setMinimumPrice(Math.min(Number(event.target.value), selectedMaximum)); setShowAll(false); }} className="mt-2 h-6 w-full cursor-pointer accent-[#e60000] disabled:cursor-default" />
                        <label htmlFor="catalogue-max-price" className="mt-3 flex justify-between gap-2 text-xs text-slate-600"><span>Maximum</span><span className="font-semibold text-slate-900">{formatPrice(selectedMaximum)}</span></label>
                        <input id="catalogue-max-price" type="range" min={priceFloor} max={priceCeiling} step={1} value={selectedMaximum} disabled={priceFloor === priceCeiling} onChange={(event) => { setMaximumPrice(Math.max(Number(event.target.value), selectedMinimum)); setShowAll(false); }} className="mt-2 h-6 w-full cursor-pointer accent-[#e60000] disabled:cursor-default" />
                        <p className="mt-2 text-[11px] leading-5 text-slate-400">Products without a listed price remain visible until you narrow the range.</p>
                      </>
                    ) : <p className="mt-2 text-xs leading-5 text-slate-500">Prices are available on request for this category.</p>}
                    <label htmlFor="catalogue-price-sort" className="mb-2 mt-4 block text-xs font-semibold text-slate-700">Price order</label>
                    <select id="catalogue-price-sort" value={priceSort} onChange={(event) => { setPriceSort(event.target.value); setShowAll(false); }} className={inputClass}>
                      <option value="featured">Default order</option>
                      <option value="low">Price: low to high</option>
                      <option value="high">Price: high to low</option>
                    </select>
                  </div>

                  {categoryPage && (
                    <div className="mt-5 border-t border-slate-100 pt-5">
                      <label htmlFor="catalogue-condition" className="mb-2 block text-xs font-semibold text-slate-700">Condition</label>
                      <select id="catalogue-condition" value={conditionFilter} onChange={(event) => { setConditionFilter(event.target.value); setShowAll(false); }} className={inputClass}>
                        <option value="all">All conditions</option>
                        <option value="new">New</option>
                        <option value="used">Used</option>
                      </select>
                    </div>
                  )}
                </aside>
              )}

              <div className="min-w-0">
                <motion.div layout className={`grid auto-rows-fr gap-4 sm:grid-cols-2 ${hasSidebar ? "lg:grid-cols-2 xl:grid-cols-4" : "lg:grid-cols-3 xl:grid-cols-5"}`}>
                  <AnimatePresence mode="popLayout">
                    {visibleProducts.map((product) => {
                      const categoryLabel = categories.find((category) => category.id === product.category)?.label ?? product.category;
                      const whatsappUrl = createWhatsAppUrl(`Hi GameX, I want to order ${product.name}. Product link: https://gamex.pk/product/${product.id}`);
                      const visibleSpecs = product.specs.slice(0, 3);
                      const remainingSpecs = Math.max(product.specs.length - 3, 0);
                      const productImages = getProductImages(product);
                      const mainImage = productImages[0] ?? product.image;

                      return (
                        <motion.div layout key={product.id} role="button" tabIndex={0} aria-label={`View details for ${product.name}`} onClick={() => setSelectedProduct(product)} onKeyDown={(event) => {
                          if (event.target !== event.currentTarget) return;
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setSelectedProduct(product);
                          }
                        }} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.28 }} className="h-full min-w-0 cursor-pointer rounded-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/15">
                          <div className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-[0_18px_50px_-38px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1">
                            <div className="relative aspect-[16/10] overflow-hidden border-b border-black/[0.05] bg-[#f7f7f7] p-2">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={mainImage} alt={`${product.name} - ${categoryLabel} at GameX Pakistan`} loading="lazy" className="h-full w-full object-contain object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]" />
                              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand/[0.035] via-transparent to-transparent" />
                              <div className="absolute left-3 top-3 z-20">
                                <span className="inline-flex rounded-full border border-brand/20 bg-white/95 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-brand shadow-sm backdrop-blur-md">{product.tag}</span>
                              </div>
                              {productImages.length > 1 && (
                                <div className="absolute right-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1.5 text-[9px] font-bold text-white backdrop-blur-md"><Images className="h-3 w-3" />{productImages.length}</div>
                              )}
                            </div>

                            <div className="flex min-w-0 flex-1 flex-col p-4">
                              <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-brand">{categoryLabel}</p>
                              <div className="mt-1.5 min-h-[2.8rem]">
                                <h3 className="line-clamp-2 font-display text-base font-extrabold leading-[1.25] text-brand-deep transition-colors">{product.name}</h3>
                              </div>
                              <div className="mt-3 w-full min-w-0 rounded-lg bg-brand px-3 py-2.5">
                                <p className="font-sans text-[10px] font-semibold leading-4 text-white/80">Price</p>
                                <p className="mt-0.5 break-words font-sans text-lg font-bold leading-6 tracking-tight text-white tabular-nums">{formatPrice(product.price)}</p>
                              </div>
                              <div className="mt-3 min-h-[4.7rem] space-y-1.5 border-t border-black/[0.06] pt-3">
                                {visibleSpecs.map((spec, index) => (
                                  <div key={`${product.id}-${index}`} className="flex min-h-[1.1rem] items-center gap-2 text-[11px] text-slate-600">
                                    <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand/[0.08] text-brand"><Check className="h-2.5 w-2.5" /></span>
                                    <span className="min-w-0 flex-1 truncate">{spec}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="h-5">{remainingSpecs > 0 && <p className="text-[9px] font-bold uppercase tracking-wider text-brand/70">+{remainingSpecs} more specifications</p>}</div>
                              <div className="mt-auto grid gap-2 pt-2">
                                <button type="button" onClick={(event) => { event.stopPropagation(); setSelectedProduct(product); }} className="flex min-h-11 w-full min-w-0 items-center justify-between gap-2 whitespace-normal rounded-xl border border-black/[0.08] bg-[#fff8f8] px-3 py-2.5 text-left text-[10px] font-bold uppercase leading-snug tracking-wider text-brand-deep transition-all duration-300 hover:border-brand hover:bg-brand hover:text-white">
                                  View Details <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                                </button>
                                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()} aria-label={`Order ${product.name} on WhatsApp`} className="flex min-h-11 w-full min-w-0 items-center justify-between gap-2 whitespace-normal rounded-xl bg-[#25D366] px-3 py-2.5 text-left text-[10px] font-bold uppercase leading-snug tracking-wider text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#20bd5a]">
                                  <span className="inline-flex items-center gap-2"><FaWhatsapp className="h-4 w-4 shrink-0" />Order Now</span>
                                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>

                {filteredProducts.length === 0 && (
                  <div className="mt-8 rounded-2xl border border-dashed border-brand/20 bg-[#fff8f8] px-6 py-12 text-center">
                    <p className="font-display text-lg font-extrabold uppercase text-brand-deep">No Products Found</p>
                    <p className="mt-2 text-sm text-slate-500">{filtersActive ? "No products match these filters. Try adjusting the price range or subcategory." : "There are no visible products in this category yet."}</p>
                    {filtersActive && <button type="button" onClick={resetFilters} className="mt-4 rounded-xl bg-brand px-5 py-3 font-sans text-sm font-semibold text-white">Reset filters</button>}
                  </div>
                )}

                {canToggle && (
                  <div className="mt-8 flex justify-center">
                    <button type="button" onClick={toggleProducts} className="group inline-flex min-w-[175px] items-center justify-center gap-2.5 rounded-xl border border-brand/20 bg-white px-6 py-3.5 font-display text-xs font-bold uppercase tracking-[0.14em] text-brand shadow-[0_12px_32px_-22px_rgba(230,0,0,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-white">
                      {showAll ? "Show Less" : "View More"}
                      {showAll ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <DetailsModal item={selectedProduct ? {
        kind: "product",
        name: selectedProduct.name,
        price: selectedProduct.price,
        eyebrow: categories.find((category) => category.id === selectedProduct.category)?.label ?? selectedProduct.category,
        badge: selectedProduct.tag,
        description: selectedProduct.description,
        specs: selectedProduct.specs,
        image: selectedProduct.image,
        images: getProductImages(selectedProduct),
      } : null} onClose={() => setSelectedProduct(null)} />
    </>
  );
}