import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { getAllOfferSlugs } from "@/lib/data/offers";
import { getAllPostSlugs } from "@/lib/data/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [offerSlugs, postSlugs] = await Promise.all([
    getAllOfferSlugs(),
    getAllPostSlugs(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/tilbud",
    "/merker",
    "/blogg",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: path === "" ? 1 : 0.8,
  }));

  const offerPages: MetadataRoute.Sitemap = offerSlugs.map((slug) => ({
    url: `${SITE_URL}/tilbud/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const postPages: MetadataRoute.Sitemap = postSlugs.map((slug) => ({
    url: `${SITE_URL}/blogg/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...offerPages, ...postPages];
}
