import slugify from "slugify";
import { KolModel } from "../../models/Kol";
import type { SortOrder } from "mongoose";

export function slugifyLite(input: string) {
  return slugify(input, { lower: true, strict: true, locale: "vi" }) || "kol";
}

export async function ensureUniqueSlug(base: string, excludeId?: string) {
  const root = slugifyLite(base);
  let slug = root;
  let i = 2;

  while (
    await KolModel.exists({
      slug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    })
  ) {
    slug = `${root}-${i++}`;
  }

  return slug;
}

export function buildSort(sort: string): { [key: string]: SortOrder } {
  const asc: SortOrder = 1;
  const desc: SortOrder = -1;

  switch (sort) {
    case "order":
      return { order: asc, createdAt: desc };
    case "-order":
      return { order: desc, createdAt: desc };
    case "rating":
      return { rating: asc, createdAt: desc };
    case "-rating":
      return { rating: desc, createdAt: desc };
    case "oldest":
      return { createdAt: asc };
    case "newest":
    default:
      return { createdAt: desc };
  }
}

export function buildFilter(params: {
  q?: string;
  niche?: string;
  tag?: string;
  platform?: string;
  admin?: boolean;
  includeDeleted?: boolean;
}) {
  const filter: any = {};

  if (!params.includeDeleted) filter.isDeleted = false;
  if (!params.admin) filter.isActive = true;

  if (params.niche) filter.niche = params.niche;
  if (params.tag) filter.tags = params.tag;
  if (params.platform) filter.platforms = params.platform;

  if (params.q) {
    filter.$text = { $search: params.q };
  }

  return filter;
}