type NamedProduct = {
  id: string;
  name: string;
};

export function createProductPaths(
  products: readonly NamedProduct[]
): Map<string, string> {
  const paths = new Map<string, string>();
  const reservedIds = new Set(products.map((product) => product.id));
  const used = new Set<string>();
  const ordered = [...products].sort((a, b) =>
    a.id < b.id ? -1 : a.id > b.id ? 1 : 0
  );
  for (const product of ordered) {
    const base = product.name
      .normalize("NFKC")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "") || "product";
    let slug = base;
    let suffix = 2;
    while (
      used.has(slug) ||
      (reservedIds.has(slug) && slug !== product.id)
    ) {
      slug = `${base}-${suffix++}`;
    }
    used.add(slug);
    paths.set(product.id, `/product/${encodeURIComponent(slug)}`);
  }
  return paths;
}