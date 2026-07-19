const DIACRITICS: Record<string, string> = {
  š: "s",
  đ: "dj",
  č: "c",
  ć: "c",
  ž: "z",
  Š: "S",
  Đ: "Dj",
  Č: "C",
  Ć: "C",
  Ž: "Z",
};

export function slugify(input: string): string {
  const transliterated = input.replace(
    /[šđčćžŠĐČĆŽ]/g,
    (char) => DIACRITICS[char] ?? char,
  );
  return transliterated
    .toLowerCase()
    .replace(/&/g, "i")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
