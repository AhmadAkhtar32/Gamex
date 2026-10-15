type NamedBuild = {
  id: string;
  name: string;
};

export function createBuildPaths(
  builds: readonly NamedBuild[]
): Map<string, string> {
  const paths = new Map<string, string>();
  const reservedIds = new Set(builds.map((build) => build.id));
  const used = new Set<string>();
  const ordered = [...builds].sort((a, b) =>
    a.id < b.id ? -1 : a.id > b.id ? 1 : 0
  );
  for (const build of ordered) {
    const base = build.name
      .normalize("NFKC")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "") || "gaming-pc";
    let slug = base;
    let suffix = 2;
    while (
      used.has(slug) ||
      (reservedIds.has(slug) && slug !== build.id)
    ) {
      slug = `${base}-${suffix++}`;
    }
    used.add(slug);
    paths.set(build.id, `/build/${encodeURIComponent(slug)}`);
  }
  return paths;
}