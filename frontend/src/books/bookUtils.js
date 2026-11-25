// bookcloth colors for generated covers
const CLOTHS = [
  "#7a2e33", // oxblood
  "#24395c", // navy
  "#2f5d50", // library green
  "#9a6a1f", // ochre
  "#553a5c", // plum
  "#3f525c", // slate
  "#1f5f63", // teal
  "#8c4426", // rust
];

export const coverColor = (title = "") => {
  // FNV-1a with a final mix, so similar titles still get different colors
  let hash = 2166136261;
  for (const char of title) {
    hash ^= char.codePointAt(0);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0x5bd1e995) >>> 0;
  hash ^= hash >>> 15;
  return CLOTHS[(hash >>> 0) % CLOTHS.length];
};

export const averageRating = (reviews = []) =>
  reviews.length
    ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
    : 0;

export const reviewCount = (n) => (n === 1 ? "1 review" : `${n} reviews`);

export const formatPrice = (price) =>
  `Rs. ${Number(price || 0).toLocaleString("en-IN")}`;

export const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";
