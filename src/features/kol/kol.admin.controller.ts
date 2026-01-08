import { KolModel } from "../../models/Kol";
import { kolCreateSchema, kolListQuerySchema, kolUpdateSchema } from "./kol.schema";
import { buildFilter, buildSort, ensureUniqueSlug } from "./kol.service";

export async function listKolAdmin(req: any, res: any) {
  const q = kolListQuerySchema.parse(req.query);

  const filter = buildFilter({
    q: q.q,
    niche: q.niche,
    tag: q.tag,
    platform: q.platform,
    admin: true,
    includeDeleted: true,
  });

  const skip = (q.page - 1) * q.limit;

  const [items, total] = await Promise.all([
    KolModel.find(filter).sort(buildSort(q.sort)).skip(skip).limit(q.limit).lean(),
    KolModel.countDocuments(filter),
  ]);

  return res.json({
    success: true,
    data: items,
    meta: {
      page: q.page,
      limit: q.limit,
      total,
      totalPages: Math.ceil(total / q.limit),
    },
  });
}

export async function getKolAdmin(req: any, res: any) {
  const { id } = req.params;

  const doc = await KolModel.findById(id).lean();
  if (!doc) {
    return res.status(404).json({
      success: false,
      error: { code: "NOT_FOUND", message: "KOL not found" },
    });
  }

  return res.json({ success: true, data: doc });
}

export async function createKolAdmin(req: any, res: any) {
  const body = kolCreateSchema.parse(req.body);

  const slug = body.slug ? body.slug : await ensureUniqueSlug(body.name);

  const created = await KolModel.create({
    ...body,
    slug,
  });

  return res.status(201).json({ success: true, data: created });
}

export async function updateKolAdmin(req: any, res: any) {
  const { id } = req.params;
  const patch = kolUpdateSchema.parse(req.body);

  if (patch.slug) {
    // ensure unique slug
    const exists = await KolModel.exists({ slug: patch.slug, _id: { $ne: id } });
    if (exists) {
      return res.status(409).json({
        success: false,
        error: { code: "CONFLICT", message: "Slug already exists" },
      });
    }
  }

  const updated = await KolModel.findByIdAndUpdate(id, patch, { new: true });
  if (!updated) {
    return res.status(404).json({
      success: false,
      error: { code: "NOT_FOUND", message: "KOL not found" },
    });
  }

  return res.json({ success: true, data: updated });
}

export async function deleteKolAdmin(req: any, res: any) {
  const { id } = req.params;

  const updated = await KolModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  if (!updated) {
    return res.status(404).json({
      success: false,
      error: { code: "NOT_FOUND", message: "KOL not found" },
    });
  }

  return res.json({ success: true, data: updated });
}

export async function restoreKolAdmin(req: any, res: any) {
  const { id } = req.params;

  const updated = await KolModel.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
  if (!updated) {
    return res.status(404).json({
      success: false,
      error: { code: "NOT_FOUND", message: "KOL not found" },
    });
  }

  return res.json({ success: true, data: updated });
}
