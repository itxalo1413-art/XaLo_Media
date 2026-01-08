import { KolModel } from "../../models/Kol";
import { kolListQuerySchema } from "./kol.schema";
import { buildFilter, buildSort } from "./kol.service";

export async function listKolPublic(req: any, res: any) {
  const q = kolListQuerySchema.parse(req.query);

  const filter = buildFilter({
    q: q.q,
    niche: q.niche,
    tag: q.tag,
    platform: q.platform,
    admin: false,
    includeDeleted: false,
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

export async function getKolBySlugPublic(req: any, res: any) {
  const { slug } = req.params;

  const doc = await KolModel.findOne({
    slug,
    isDeleted: false,
    isActive: true,
  }).lean();

  if (!doc) {
    return res.status(404).json({
      success: false,
      error: { code: "NOT_FOUND", message: "KOL not found" },
    });
  }

  return res.json({ success: true, data: doc });
}
