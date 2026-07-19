export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

/** False until a real Sanity project is provisioned — pages fall back to local seed data. */
export const sanityConfigured = Boolean(projectId && dataset);
