export function shuffled<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}
export function balancedCatalogue<T extends { category: string }>(
  items: readonly T[],
  random: () => number = Math.random
): T[] {
  const grouped = new Map<string, T[]>();
  for (const item of items) {
    grouped.set(item.category, [...(grouped.get(item.category) ?? []), item]);
  }
  const groups = shuffled([...grouped.values()], random).map((group) => shuffled(group, random));
  const result: T[] = [];
  for (let round = 0; groups.some((group) => round < group.length); round++) {
    for (const group of groups) {
      if (group[round]) result.push(group[round]);
    }
  }
  return result;
}
export function relatedCatalogue<T extends { id: string; category: string }>(
  items: readonly T[],
  current: { id: string; category: string },
  limit = 5,
  random: () => number = Math.random
): T[] {
  const candidates = items.filter((item) => item.id !== current.id);
  const same = shuffled(candidates.filter((item) => item.category === current.category), random);
  const other = balancedCatalogue(candidates.filter((item) => item.category !== current.category), random);
  const preferred = same.slice(0, Math.min(3, limit));
  const crossCategory = other.slice(0, Math.max(0, limit - preferred.length));
  const remaining = limit - preferred.length - crossCategory.length;
  return shuffled([
    ...preferred,
    ...crossCategory,
    ...same.slice(preferred.length, preferred.length + remaining),
  ], random);
}