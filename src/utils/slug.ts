import slugify from "slugify";

export function makeSlug(input: string) {
  return slugify(input, { lower: true, strict: true, trim: true });
}

// model = Mongoose model; excludeId để update không tính chính nó
export async function ensureUniqueSlug(
  model: any,
  baseSlug: string,
  excludeId?: string
): Promise<string> {
  let slug = baseSlug;
  let i = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query: any = { slug };
    if (excludeId) query._id = { $ne: excludeId };

    const exists = await model.findOne(query).select("_id").lean();
    if (!exists) return slug;

    i += 1;
    slug = `${baseSlug}-${i}`;
  }
}
