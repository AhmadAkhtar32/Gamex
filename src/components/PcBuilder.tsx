"use client";
import { type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Check, CheckCircle2, ChevronRight, CircleDollarSign, Cpu, ExternalLink, ImageIcon, Minus, Package, Plus, RotateCcw, ShoppingCart, Trash2, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { formatPrice } from "@/lib/price";
const SITE_URL = "https://gamex.pk";
type BuilderSettings = {
  title: string;
  subtitle: string;
  readyBuildsLabel: string;
  scratchBuilderLabel: string;
  quoteButtonText: string;
  whatsappNumber: string;
  showReadyBuilds: boolean;
  showScratchBuilder: boolean;
};
type BuilderCategory = {
  id: number;
  name: string;
  slug: string;
  description: string;
  helpText: string;
  isRequired: boolean;
};
type CatalogProduct = {
  id: string;
  name: string;
  category: string;
  tag: string;
  price: number | null;
  description: string;
  specs: string[];
  image: string;
};
type ReadyBuild = {
  id: string;
  name: string;
  role: string;
  badge: string;
  price: number | null;
  description: string;
  specs: string[];
  image: string;
};
type BuilderMode = "scratch" | "ready";
type SelectableItem = {
  key: string;
  id: string;
  name: string;
  price: number | null;
  description: string;
  specs: string[];
  image: string;
  productUrl: string;
  badge: string;
};
type SelectedPart = {
  key: string;
  source: "product" | "custom";
  categoryId: number;
  name: string;
  price: number | null;
  quantity: number;
  description: string;
  specs: string[];
  image: string;
  productUrl: string;
  note: string;
};
type CustomExtra = {
  id: string;
  name: string;
  price: number | null;
  quantity: number;
  productUrl: string;
  note: string;
};
type SelectionMap = Record<number, SelectedPart[] | undefined>;
type CustomPartInput = {
  name: string;
  price: number | null;
  quantity: number;
  productUrl: string;
  note: string;
};
function productMatchesCategory(category: BuilderCategory, product: CatalogProduct) {
  return product.category === category.slug;
}
function createLocalId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function parseOptionalPrice(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return Math.round(parsed);
}
function validQuantity(value: number) {
  return Number.isSafeInteger(value) && value >= 1;
}
function normalizeLink(value: string) {
  const link = value.trim();
  if (!link) return "";
  if (link.startsWith("/") && !link.startsWith("//")) return `${SITE_URL}${link}`;
  return link;
}
function addListedPart(current: SelectionMap, categoryId: number, item: SelectableItem): SelectionMap {
  const parts = current[categoryId] ?? [];
  const existing = parts.find((part) => part.key === item.key);
  if (existing) {
    const quantity = existing.quantity + 1;
    if (!validQuantity(quantity)) return current;
    return {
      ...current,
      [categoryId]: parts.map((part) => part.key === item.key ? { ...part, quantity } : part),
    };
  }
  return {
    ...current,
    [categoryId]: [...parts, {
      key: item.key,
      source: "product",
      categoryId,
      name: item.name,
      price: item.price,
      quantity: 1,
      description: item.description,
      specs: item.specs,
      image: item.image,
      productUrl: item.productUrl,
      note: "",
    }],
  };
}
function updatePartQuantity(current: SelectionMap, categoryId: number, key: string, quantity: number): SelectionMap {
  if (!validQuantity(quantity)) return current;
  return {
    ...current,
    [categoryId]: (current[categoryId] ?? []).map((part) => part.key === key ? { ...part, quantity } : part),
  };
}
function removeSelectedPart(current: SelectionMap, categoryId: number, key: string): SelectionMap {
  const next = { ...current };
  const parts = (current[categoryId] ?? []).filter((part) => part.key !== key);
  if (parts.length) next[categoryId] = parts;
  else delete next[categoryId];
  return next;
}
function selectionTotal(selections: SelectionMap) {
  return Object.values(selections).reduce(
    (sum, parts) => sum + (parts ?? []).reduce(
      (subtotal, part) => subtotal + (part.price ?? 0) * part.quantity,
      0
    ),
    0
  );
}
function quoteItemLines(item: {
  name: string;
  price: number | null;
  quantity: number;
  note: string;
  productUrl: string;
}, custom: boolean) {
  const lines = [
    `${item.name} × ${item.quantity}`,
    item.price === null
      ? "Price on request"
      : `Unit: ${formatPrice(item.price)} | Subtotal: ${formatPrice(item.price * item.quantity)}`,
  ];
  if (custom) lines.push("Custom customer request — expected price, subject to confirmation");
  if (item.note) lines.push(`Note: ${item.note}`);
  if (item.productUrl) lines.push(normalizeLink(item.productUrl));
  return lines;
}
export function PcBuilder({ settings, categories, products, builds }: {
  settings: BuilderSettings;
  categories: BuilderCategory[];
  products: CatalogProduct[];
  builds: ReadyBuild[];
}) {
  const [mode, setMode] = useState<BuilderMode>(settings.showScratchBuilder ? "scratch" : "ready");
  const [selections, setSelections] = useState<SelectionMap>({});
  const [activeCategory, setActiveCategory] = useState<BuilderCategory | null>(null);
  const closeSelector = useCallback(() => setActiveCategory(null), []);
  const [customFirst, setCustomFirst] = useState(false);
  const [extras, setExtras] = useState<CustomExtra[]>([]);
  const [showExtraForm, setShowExtraForm] = useState(false);
  const optionsByCategory = useMemo(() => {
    const result: Record<number, SelectableItem[]> = {};
    for (const category of categories) {
      result[category.id] = products.filter((product) => productMatchesCategory(category, product)).map((product) => ({
        key: `product-${product.id}`,
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        specs: product.specs,
        image: product.image,
        productUrl: `/product/${product.id}`,
        badge: product.tag,
      }));
    }
    return result;
  }, [categories, products]);
  const componentsTotal = useMemo(() => selectionTotal(selections), [selections]);
  const extrasTotal = useMemo(
    () => extras.reduce((sum, extra) => sum + (extra.price ?? 0) * extra.quantity, 0),
    [extras]
  );
  const total = componentsTotal + extrasTotal;
  const selectedCount = categories.filter((category) => (selections[category.id]?.length ?? 0) > 0).length;
  const unitCount = Object.values(selections).flatMap((parts) => parts ?? []).reduce(
    (sum, part) => sum + part.quantity,
    0
  ) + extras.reduce((sum, extra) => sum + extra.quantity, 0);
  const activeItems = activeCategory ? optionsByCategory[activeCategory.id] ?? [] : [];
  function selectListedItem(categoryId: number, item: SelectableItem) {
    setSelections((current) => addListedPart(current, categoryId, item));
  }
  function selectCustomPart(categoryId: number, input: CustomPartInput) {
    if (!validQuantity(input.quantity)) return;
    const part: SelectedPart = {
      key: `custom-${createLocalId()}`,
      source: "custom",
      categoryId,
      name: input.name,
      price: input.price,
      quantity: input.quantity,
      description: input.note,
      specs: [],
      image: "",
      productUrl: input.productUrl,
      note: input.note,
    };
    setSelections((current) => ({
      ...current,
      [categoryId]: [...(current[categoryId] ?? []), part],
    }));
    setActiveCategory(null);
  }
  function removeItem(categoryId: number, key: string) {
    setSelections((current) => removeSelectedPart(current, categoryId, key));
  }
  function changeQuantity(categoryId: number, key: string, quantity: number) {
    setSelections((current) => updatePartQuantity(current, categoryId, key, quantity));
  }
  function addExtra(input: CustomPartInput) {
    if (!validQuantity(input.quantity)) return;
    setExtras((current) => [...current, { id: createLocalId(), ...input }]);
    setShowExtraForm(false);
  }
  function removeExtra(id: string) {
    setExtras((current) => current.filter((extra) => extra.id !== id));
  }
  function changeExtraQuantity(id: string, quantity: number) {
    if (!validQuantity(quantity)) return;
    setExtras((current) => current.map((extra) => extra.id === id ? { ...extra, quantity } : extra));
  }
  function clearBuild() {
    setSelections({});
    setExtras([]);
  }
  function openCategory(category: BuilderCategory, custom = false) {
    setCustomFirst(custom);
    setActiveCategory(category);
  }
  function createQuoteMessage() {
    const lines = ["Hi GameX, I want a quotation for this custom PC build:", ""];
    categories.forEach((category) => {
      const parts = selections[category.id] ?? [];
      lines.push(`*${category.name}*`);
      if (parts.length) {
        parts.forEach((part) => lines.push(...quoteItemLines(part, part.source === "custom"), ""));
      } else {
        lines.push(category.isRequired ? "Not selected (Required)" : "Not selected", "");
      }
    });
    lines.push("*CUSTOM / EXTRA ITEMS*", "");
    if (extras.length) {
      extras.forEach((extra, index) => lines.push(`${index + 1}.`, ...quoteItemLines(extra, true), ""));
    } else {
      lines.push("None", "");
    }
    lines.push(
      "--------------------",
      `*ESTIMATED TOTAL: ${formatPrice(total)}*`,
      "",
      "Items with Price on request are not included in the calculated total.",
      "Custom prices are customer estimates. Please confirm availability, compatibility and final pricing.",
      "",
      `Builder: ${SITE_URL}/build-your-rig`
    );
    return lines.join("\n");
  }
  const quoteUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(createQuoteMessage())}`;
  return (
    <main className="min-h-screen bg-[#fff8f8] pb-28 pt-20 lg:pb-16">
      <section className="border-b border-brand/10 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-8 text-center md:px-8 md:py-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/15 bg-brand/[0.05] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-brand">
            <Cpu className="h-4 w-4" />GameX PC Builder
          </span>
          <h1 className="mx-auto mt-4 max-w-4xl font-display text-3xl font-black uppercase text-brand-deep sm:text-4xl lg:text-5xl">{settings.title}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-500">{settings.subtitle}</p>
          <div className="mx-auto mt-6 inline-flex max-w-full flex-wrap justify-center rounded-2xl border border-brand/10 bg-[#fff8f8] p-1.5">
            {settings.showReadyBuilds && (
              <button type="button" onClick={() => setMode("ready")} className={`rounded-xl px-5 py-3 text-xs font-bold uppercase ${mode === "ready" ? "bg-brand text-white" : "text-slate-500"}`}>
                {settings.readyBuildsLabel}
              </button>
            )}
            {settings.showScratchBuilder && (
              <button type="button" onClick={() => setMode("scratch")} className={`rounded-xl px-5 py-3 text-xs font-bold uppercase ${mode === "scratch" ? "bg-brand text-white" : "text-slate-500"}`}>
                {settings.scratchBuilderLabel}
              </button>
            )}
          </div>
        </div>
      </section>
      {mode === "ready" ? <ReadyBuilds builds={builds} whatsappNumber={settings.whatsappNumber} /> : (
        <section className="mx-auto max-w-7xl px-5 py-8 md:px-8">
          <div className="grid items-stretch gap-7 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="flex min-w-0 flex-col">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">Build From Scratch</p>
                  <h2 className="mt-1 font-display text-2xl font-extrabold uppercase text-brand-deep">Choose Your Components</h2>
                </div>
                {(selectedCount > 0 || extras.length > 0) && (
                  <button type="button" onClick={clearBuild} className="inline-flex items-center gap-2 rounded-xl border border-brand/15 px-4 py-2.5 text-xs font-bold uppercase text-brand">
                    <RotateCcw className="h-4 w-4" />Clear
                  </button>
                )}
              </div>
              <p className="mb-4 font-sans text-xs leading-5 text-slate-500">
                Add different items to any category, or increase the quantity for identical items. Quantities refer to the product as listed, including any kit or pack.
              </p>
              <div className="space-y-3">
                {categories.map((category, index) => {
                  const parts = selections[category.id] ?? [];
                  const options = optionsByCategory[category.id] ?? [];
                  return (
                    <div key={category.id} className="rounded-2xl border border-brand/10 bg-white p-5">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/[0.08] font-display text-sm font-extrabold text-brand">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-display text-lg font-extrabold uppercase text-brand-deep">{category.name}</h3>
                            <span className="rounded-full bg-brand/[0.07] px-2.5 py-1 text-[9px] font-bold uppercase text-brand">
                              {category.isRequired ? "Required" : "Optional"}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-slate-400">{category.helpText}</p>
                          {!parts.length && (
                            <p className="mt-2 text-xs font-semibold text-slate-500">
                              {options.length ? `${options.length} product${options.length === 1 ? "" : "s"} available` : "No listed items yet. You can add a custom request."}
                            </p>
                          )}
                        </div>
                        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                          <button type="button" onClick={() => openCategory(category, true)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-brand/15 px-3 text-xs font-bold text-brand">
                            <Plus className="h-4 w-4" />Add Custom
                          </button>
                          <button type="button" onClick={() => openCategory(category)} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand px-4 text-xs font-bold text-white">
                            {parts.length ? "Add More" : "Select"}<ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      {parts.length > 0 && (
                        <div className="mt-4 space-y-2 border-t border-brand/10 pt-4">
                          {parts.map((part) => (
                            <SelectedItemRow key={part.key} item={part} onQuantity={(quantity) => changeQuantity(category.id, part.key, quantity)} onRemove={() => removeItem(category.id, part.key)} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 rounded-2xl border border-brand/10 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand/10 p-5">
                  <div>
                    <h3 className="font-display text-lg font-extrabold uppercase text-brand-deep">Extras</h3>
                    <p className="mt-1 text-xs text-slate-400">Add additional custom items outside the component categories.</p>
                  </div>
                  <button type="button" onClick={() => setShowExtraForm((value) => !value)} className="inline-flex items-center gap-2 rounded-xl border border-brand/15 px-4 py-2.5 text-xs font-bold uppercase text-brand">
                    <Plus className="h-4 w-4" />Add Extra
                  </button>
                </div>
                {extras.length > 0 && (
                  <div className="space-y-2 p-4">
                    {extras.map((extra) => (
                      <SelectedItemRow key={extra.id} item={extra} onQuantity={(quantity) => changeExtraQuantity(extra.id, quantity)} onRemove={() => removeExtra(extra.id)} />
                    ))}
                  </div>
                )}
                {showExtraForm && (
                  <div className="border-t border-brand/10 p-5">
                    <CustomRequestForm buttonText="Add Extra" onSubmit={addExtra} onCancel={() => setShowExtraForm(false)} />
                  </div>
                )}
              </div>
            </div>
            <aside className="flex min-w-0 self-stretch">
              <BuildSummary
                categories={categories}
                selections={selections}
                extras={extras}
                selectedCount={selectedCount}
                unitCount={unitCount}
                total={total}
                quoteUrl={quoteUrl}
                quoteButtonText={settings.quoteButtonText}
                onRemove={removeItem}
                onQuantity={changeQuantity}
                onRemoveExtra={removeExtra}
                onExtraQuantity={changeExtraQuantity}
              />
            </aside>
          </div>
        </section>
      )}
      {activeCategory && (
        <ItemSelector
          key={activeCategory.id}
          category={activeCategory}
          items={activeItems}
          selectedItems={selections[activeCategory.id] ?? []}
          customFirst={customFirst}
          onSelect={selectListedItem}
          onSelectCustom={selectCustomPart}
          onQuantity={changeQuantity}
          onRemove={removeItem}
          onClose={closeSelector}
        />
      )}
    </main>
  );
}
function QuantityControl({ name, quantity, onChange }: {
  name: string;
  quantity: number;
  onChange: (quantity: number) => void;
}) {
  return (
    <div role="group" aria-label={`Quantity for ${name}`} className="inline-flex shrink-0 items-center overflow-hidden rounded-lg border border-brand/15 bg-white">
      <button type="button" aria-label={`Decrease quantity of ${name}`} disabled={quantity <= 1} onClick={() => onChange(quantity - 1)} className="grid h-9 w-9 place-items-center text-brand hover:bg-red-50 disabled:cursor-default disabled:text-slate-300">
        <Minus className="h-3.5 w-3.5" />
      </button>
      <input
        type="number"
        min={1}
        step={1}
        aria-label={`Quantity of ${name}`}
        value={quantity}
        onChange={(event) => {
          const value = Number(event.target.value);
          if (validQuantity(value)) onChange(value);
        }}
        className="h-9 w-12 min-w-0 border-x border-brand/10 bg-white text-center font-sans text-xs font-semibold outline-none focus:bg-red-50"
      />
      <button type="button" aria-label={`Increase quantity of ${name}`} disabled={!validQuantity(quantity + 1)} onClick={() => onChange(quantity + 1)} className="grid h-9 w-9 place-items-center text-brand hover:bg-red-50 disabled:text-slate-300">
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
function SelectedItemRow({ item, onQuantity, onRemove }: {
  item: SelectedPart | CustomExtra;
  onQuantity: (quantity: number) => void;
  onRemove: () => void;
}) {
  const custom = !("source" in item) || item.source === "custom";
  return (
    <div className="rounded-xl border border-brand/10 bg-[#fff8f8] p-3">
      <div className="flex items-start gap-3">
        {"image" in item && (
          <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-white">
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.image} alt={item.name} className="h-full w-full object-contain p-1" />
            ) : <Package className="h-5 w-5 text-slate-300" />}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="break-words text-xs font-bold text-brand-deep">{item.name}</p>
          {custom && <p className="mt-1 text-[10px] font-semibold text-slate-500">Custom request · estimate</p>}
          <p className="mt-1 text-xs text-slate-500">{item.price === null ? "Price on request" : `${formatPrice(item.price)} each`}</p>
          {item.note && <p className="mt-1 whitespace-pre-line break-words text-xs text-slate-500">{item.note}</p>}
          {item.productUrl && (
            <a href={normalizeLink(item.productUrl)} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-brand">
              {custom ? "Reference link" : "Product details"}<ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        <button type="button" aria-label={`Remove ${item.name}`} onClick={onRemove} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-red-500 hover:bg-red-100">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <QuantityControl name={item.name} quantity={item.quantity} onChange={onQuantity} />
        <p className="break-words font-sans text-xs font-bold text-brand">{item.price === null ? "Price on request" : formatPrice(item.price * item.quantity)}</p>
      </div>
    </div>
  );
}
function ReadyBuilds({ builds, whatsappNumber }: {
  builds: ReadyBuild[];
  whatsappNumber: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
      <div className="mb-7">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">Ready To Order</p>
        <h2 className="mt-1 font-display text-2xl font-extrabold uppercase text-brand-deep">GameX Ready Builds</h2>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {builds.map((build) => {
          const url = `${SITE_URL}/build/${build.id}`;
          const whatsapp = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi GameX, I want a quotation for ${build.name}.\n${url}`)}`;
          return (
            <article key={build.id} className="overflow-hidden rounded-2xl border border-brand/10 bg-white">
              <div className="aspect-[16/10] bg-[#f7f7f7] p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={build.image} alt={build.name} className="h-full w-full object-contain" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl font-extrabold uppercase text-brand-deep">{build.name}</h3>
                <p className="mt-3 font-display text-xl font-bold text-brand">{formatPrice(build.price)}</p>
                <div className="mt-4 space-y-2">
                  {build.specs.slice(0, 4).map((spec, index) => (
                    <div key={`${spec}-${index}`} className="flex items-start gap-2 text-xs text-slate-500">
                      <Check className="mt-0.5 h-3.5 w-3.5 text-brand" />{spec}
                    </div>
                  ))}
                </div>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  <Link href={`/build/${build.id}`} className="rounded-xl border border-brand/15 px-4 py-3 text-center text-xs font-bold uppercase text-brand">View Build</Link>
                  <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-xs font-bold uppercase text-white">
                    <FaWhatsapp className="h-4 w-4" />Get Quote
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
function BuildSummary({
  categories,
  selections,
  extras,
  selectedCount,
  unitCount,
  total,
  quoteUrl,
  quoteButtonText,
  onRemove,
  onQuantity,
  onRemoveExtra,
  onExtraQuantity,
}: {
  categories: BuilderCategory[];
  selections: SelectionMap;
  extras: CustomExtra[];
  selectedCount: number;
  unitCount: number;
  total: number;
  quoteUrl: string;
  quoteButtonText: string;
  onRemove: (categoryId: number, key: string) => void;
  onQuantity: (categoryId: number, key: string, quantity: number) => void;
  onRemoveExtra: (id: string) => void;
  onExtraQuantity: (id: string, quantity: number) => void;
}) {
  return (
    <div className="flex w-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-brand/10 bg-white">
      <div className="shrink-0 bg-brand p-5 text-white">
        <div className="flex items-center gap-3">
          <ShoppingCart className="h-5 w-5" />
          <div>
            <p className="text-[9px] uppercase text-white/60">Your Configuration</p>
            <h2 className="font-display text-lg font-extrabold uppercase">Build Summary</h2>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/10 p-3">
            <p className="text-[9px] uppercase text-white/60">Categories Selected</p>
            <p className="mt-1 break-words font-sans font-bold tabular-nums">{selectedCount}/{categories.length}</p>
            <p className="mt-1 text-[10px] text-white/70">{unitCount} total units</p>
          </div>
          <div className="rounded-xl bg-white/10 p-3">
            <p className="text-[9px] uppercase text-white/60">Estimated Total</p>
            <p className="mt-1 break-words font-sans font-bold tabular-nums">{formatPrice(total)}</p>
          </div>
        </div>
      </div>
      <div className="min-w-0 flex-1 space-y-3 p-4">
        {categories.map((category) => {
          const parts = selections[category.id] ?? [];
          return (
            <div key={category.id}>
              <p className="mb-2 text-[10px] font-bold uppercase text-slate-400">{category.name}</p>
              {parts.length ? (
                <div className="space-y-2">
                  {parts.map((part) => (
                    <SelectedItemRow key={part.key} item={part} onQuantity={(quantity) => onQuantity(category.id, part.key, quantity)} onRemove={() => onRemove(category.id, part.key)} />
                  ))}
                </div>
              ) : (
                <p className="rounded-xl border border-black/[0.06] bg-[#fffafa] p-3 text-xs text-slate-400">
                  {category.isRequired ? "Not selected · Required" : "Not selected"}
                </p>
              )}
            </div>
          );
        })}
        {extras.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase text-brand">Extras</p>
            <div className="space-y-2">
              {extras.map((extra) => (
                <SelectedItemRow key={extra.id} item={extra} onQuantity={(quantity) => onExtraQuantity(extra.id, quantity)} onRemove={() => onRemoveExtra(extra.id)} />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="shrink-0 border-t border-brand/10 p-4">
        <div className="flex min-w-0 items-end justify-between gap-3">
          <div>
            <p className="text-[9px] font-bold uppercase text-slate-400">Estimated Build Total</p>
            <p className="break-words font-sans text-2xl font-bold text-brand-deep tabular-nums">{formatPrice(total)}</p>
          </div>
          <CircleDollarSign className="h-7 w-7 shrink-0 text-brand/30" />
        </div>
        <p className="mt-2 text-[11px] leading-5 text-slate-500">
          Unpriced items are excluded. Custom prices are estimates; GameX will confirm availability, compatibility and final pricing.
        </p>
        <a href={quoteUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3.5 font-sans text-xs font-semibold leading-6 tracking-wide text-white">
          <FaWhatsapp className="h-5 w-5 shrink-0" />{quoteButtonText}
        </a>
      </div>
    </div>
  );
}
function ItemSelector({
  category,
  items,
  selectedItems,
  customFirst,
  onSelect,
  onSelectCustom,
  onQuantity,
  onRemove,
  onClose,
}: {
  category: BuilderCategory;
  items: SelectableItem[];
  selectedItems: SelectedPart[];
  customFirst: boolean;
  onSelect: (categoryId: number, item: SelectableItem) => void;
  onSelectCustom: (categoryId: number, input: CustomPartInput) => void;
  onQuantity: (categoryId: number, key: string, quantity: number) => void;
  onRemove: (categoryId: number, key: string) => void;
  onClose: () => void;
}) {
  const [showCustom, setShowCustom] = useState(customFirst || items.length === 0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const customRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const bodyOverflow = document.body.style.overflow;
    const rootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const elements = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), textarea:not(:disabled)') ?? []
      ).filter((element) => element.getClientRects().length > 0);
      const first = elements[0];
      const last = elements[elements.length - 1];
      const focused = document.activeElement;
      const outside = !dialogRef.current?.contains(focused);
      if (event.shiftKey && (focused === first || outside)) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && (focused === last || outside)) {
        event.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = rootOverflow;
      window.removeEventListener("keydown", onKey);
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [onClose]);
  useEffect(() => {
    if (!showCustom) return;
    customRef.current?.scrollIntoView({ block: "nearest" });
    customRef.current?.querySelector<HTMLInputElement>('input[name="customName"]')?.focus({ preventScroll: true });
  }, [showCustom]);
  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-2 backdrop-blur-sm sm:p-5" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="builder-selector-title" className="flex max-h-[calc(100dvh-1rem)] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white sm:max-h-[92dvh] sm:rounded-3xl">
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-brand/10 px-5 py-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand">Add Components</p>
            <h2 id="builder-selector-title" className="mt-1 break-words font-display text-xl font-extrabold uppercase text-brand-deep">{category.name}</h2>
            <p className="mt-2 text-xs text-slate-500">{category.description}</p>
            <p aria-live="polite" className="mt-2 text-xs font-semibold text-brand">
              {selectedItems.reduce((sum, part) => sum + part.quantity, 0)} units selected · Add items, then press Done
            </p>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close component selector" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div data-lenis-prevent data-lenis-prevent-wheel data-lenis-prevent-touch className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[#fff8f8] p-4 [scrollbar-width:thin] sm:p-6">
          {items.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => {
                const selected = selectedItems.find((part) => part.key === item.key);
                return (
                  <article key={item.key} className={`flex flex-col overflow-hidden rounded-2xl border bg-white ${selected ? "border-brand" : "border-brand/10"}`}>
                    <div className="relative aspect-[16/10] bg-[#f5f5f5] p-2">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                      ) : <ImageIcon className="m-auto mt-16 h-10 w-10 text-slate-200" />}
                      {selected && (
                        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-brand px-2.5 py-1.5 text-xs font-bold text-white">
                          <CheckCircle2 className="h-4 w-4" />×{selected.quantity}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="font-display text-base font-extrabold text-brand-deep">{item.name}</h3>
                      <p className="mt-2 font-sans text-lg font-extrabold text-brand">
                        {item.price === null ? "Price on request" : formatPrice(item.price)}
                        <span className="ml-1 text-[10px] font-normal text-slate-500">per item</span>
                      </p>
                      <div className="mt-3 space-y-1">
                        {item.specs.slice(0, 3).map((spec, index) => (
                          <div key={`${spec}-${index}`} className="flex gap-2 text-[11px] text-slate-500">
                            <Check className="h-3 w-3 shrink-0 text-brand" /><span className="line-clamp-1">{spec}</span>
                          </div>
                        ))}
                      </div>
                      <Link href={item.productUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase text-brand">
                        Product Details<ExternalLink className="h-3 w-3" />
                      </Link>
                      <div className="mt-auto pt-4">
                        {selected ? (
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <QuantityControl name={item.name} quantity={selected.quantity} onChange={(quantity) => onQuantity(category.id, item.key, quantity)} />
                            <button type="button" aria-label={`Remove ${item.name}`} onClick={() => onRemove(category.id, item.key)} className="grid h-9 w-9 place-items-center rounded-lg text-red-500 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <button type="button" onClick={() => onSelect(category.id, item)} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-xs font-bold text-white">
                            <Plus className="h-4 w-4" />Add to Build
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-brand/20 bg-white p-5 text-center">
              <Package className="mx-auto h-9 w-9 text-brand/30" />
              <h3 className="mt-3 font-display text-lg font-extrabold uppercase text-brand-deep">No Products In This Category</h3>
              <p className="mt-2 text-sm text-slate-500">Request an unlisted component below. GameX will confirm its availability and price.</p>
            </div>
          )}
          <div ref={customRef} className="mt-5 rounded-2xl border border-dashed border-brand/20 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-display font-extrabold uppercase text-brand-deep">Can&apos;t Find Your Part?</h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">Add an unlisted component request without replacing your selected items.</p>
              </div>
              <button type="button" aria-expanded={showCustom} onClick={() => setShowCustom((value) => !value)} className="rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-white">
                {showCustom ? "Hide Form" : "Add Custom"}
              </button>
            </div>
            {showCustom && (
              <div className="mt-5 border-t border-brand/10 pt-5">
                <CustomRequestForm buttonText={`Add Custom ${category.name}`} onSubmit={(input) => onSelectCustom(category.id, input)} />
              </div>
            )}
          </div>
          {selectedItems.some((part) => part.source === "custom") && (
            <div className="mt-5 space-y-2">
              <p className="text-xs font-semibold text-brand">Custom requests already added</p>
              {selectedItems.filter((part) => part.source === "custom").map((part) => (
                <SelectedItemRow key={part.key} item={part} onQuantity={(quantity) => onQuantity(category.id, part.key, quantity)} onRemove={() => onRemove(category.id, part.key)} />
              ))}
            </div>
          )}
        </div>
        <div className="flex shrink-0 justify-end border-t border-brand/10 bg-white px-5 py-3">
          <button type="button" onClick={onClose} className="min-h-11 rounded-xl bg-brand px-6 text-sm font-bold text-white">Done</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
function CustomRequestForm({ buttonText, onSubmit, onCancel }: {
  buttonText: string;
  onSubmit: (input: CustomPartInput) => void;
  onCancel?: () => void;
}) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("customName") ?? "").trim();
    const quantity = Number(data.get("customQuantity"));
    if (!name || !validQuantity(quantity)) return;
    onSubmit({
      name,
      quantity,
      price: parseOptionalPrice(data.get("customPrice")),
      productUrl: String(data.get("customProductUrl") ?? "").trim(),
      note: String(data.get("customNote") ?? "").trim(),
    });
    form.reset();
  }
  const inputClass = "mt-2 w-full rounded-xl border border-brand/15 px-4 py-3 font-sans text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10";
  return (
    <form onSubmit={handleSubmit}>
      <p className="mb-4 font-sans text-xs leading-5 text-slate-500">
        This adds a request to your quote, not a new shop product. Leave the price blank if unknown; an entered price is your expected price per item.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-[10px] font-bold uppercase text-slate-500">
          Item / Component Name
          <input name="customName" required maxLength={200} className={inputClass} />
        </label>
        <label className="block text-[10px] font-bold uppercase text-slate-500">
          Expected Unit Price
          <input name="customPrice" type="number" min="0" step="1" className={inputClass} />
        </label>
        <label className="block text-[10px] font-bold uppercase text-slate-500">
          Quantity
          <input name="customQuantity" type="number" required min="1" step="1" defaultValue={1} className={inputClass} />
        </label>
        <label className="block text-[10px] font-bold uppercase text-slate-500">
          Product / Reference Link
          <input name="customProductUrl" type="url" placeholder="https://..." className={inputClass} />
        </label>
      </div>
      <label className="mt-4 block text-[10px] font-bold uppercase text-slate-500">
        Requirements / Note
        <textarea name="customNote" rows={3} className={inputClass} />
      </label>
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-xl border border-brand/15 px-4 py-3 text-xs font-bold uppercase text-brand">Cancel</button>
        )}
        <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-xs font-bold text-white">
          <Plus className="h-4 w-4" />{buttonText}
        </button>
      </div>
    </form>
  );
}