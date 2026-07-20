import { products, rankProductsByQuery } from "@/lib/products";

describe("Search: rankProductsByQuery", () => {
  test('should find drills when searching "bušilica"', () => {
    const results = rankProductsByQuery(products, "bušilica");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((p) => p.name.includes("Bosch"))).toBe(true);
  });

  test('should find the same drills when searching "busilica" (without diacritics)', () => {
    const withDiacritics = rankProductsByQuery(products, "bušilica");
    const withoutDiacritics = rankProductsByQuery(products, "busilica");
    expect(withoutDiacritics.length).toBeGreaterThan(0);
    expect(withoutDiacritics.map((p) => p.slug)).toEqual(withDiacritics.map((p) => p.slug));
  });

  test('should find only Makita products when searching "Makita"', () => {
    const results = rankProductsByQuery(products, "Makita");
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((p) => p.name.includes("Makita"))).toBe(true);
  });

  test('should find cordless products when searching "akumulatorska"', () => {
    const results = rankProductsByQuery(products, "akumulatorska");
    expect(results.length).toBeGreaterThan(0);
  });

  test("should return empty array for a nonsense query", () => {
    const results = rankProductsByQuery(products, "xyzabc123");
    expect(results.length).toBe(0);
  });

  test("should return empty array for an empty/whitespace query", () => {
    expect(rankProductsByQuery(products, "")).toEqual([]);
    expect(rankProductsByQuery(products, "   ")).toEqual([]);
  });

  test("should rank an exact product name match first", () => {
    const results = rankProductsByQuery(products, "Makita HR2470");
    expect(results[0].name).toBe("Makita HR2470");
  });

  test("should rank a name-prefix match before a description-only substring match", () => {
    // "Bosch GWS" is a name-prefix for "Bosch GWS 750" (rank 1). "brusilica"
    // (grinder) also appears in that product's own description, so this
    // isolates prefix-vs-substring ordering using distinct products instead.
    const results = rankProductsByQuery(products, "bosch");
    const prefixMatches = results.filter((p) => p.name.toLowerCase().startsWith("bosch"));
    expect(results.slice(0, prefixMatches.length).every((p) => p.name.toLowerCase().startsWith("bosch"))).toBe(
      true,
    );
  });
});
