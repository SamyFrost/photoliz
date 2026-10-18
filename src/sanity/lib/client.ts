import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "../env";

export const client = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: false, perspective: "published" })
  : null;

/** Tag every query with "sanity" so one webhook call refreshes the whole site. */
export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T | null> {
  if (!client) return null;
  try {
    return await client.fetch<T>(query, params, { next: { tags: ["sanity"], revalidate: 3600 } });
  } catch (err) {
    console.error("[sanity] query failed, using fallback content", err);
    return null;
  }
}
