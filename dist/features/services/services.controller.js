"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRestoreService = exports.adminDeleteService = exports.adminUpdateService = exports.adminCreateService = exports.adminGetService = exports.adminListServices = exports.getPublicServiceBySlug = exports.getPublicServices = void 0;
const slugify_1 = __importDefault(require("slugify"));
const Service_1 = require("../../models/Service");
const asyncHandler_1 = require("../../utils/asyncHandler");
const response_1 = require("../../utils/response");
const services_schema_1 = require("./services.schema");
function normalizeSlug(input) {
    return (0, slugify_1.default)(input, { lower: true, strict: true, trim: true });
}
function sortHighlights(list) {
    return [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
/* =========================
   PUBLIC
========================= */
exports.getPublicServices = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { q, page, limit } = services_schema_1.publicListQuerySchema.parse(req.query);
    const skip = (page - 1) * limit;
    const filter = { isDeleted: false, isActive: true };
    const sort = { order: 1, createdAt: -1 };
    if (q) {
        filter.$text = { $search: q };
        sort.score = { $meta: "textScore" };
        sort.order = 1;
    }
    const [items, total] = await Promise.all([
        Service_1.Service.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .select("title slug iconKey shortDescription highlights stat coverImageUrl order seo createdAt updatedAt")
            .lean(),
        Service_1.Service.countDocuments(filter),
    ]);
    return (0, response_1.ok)(res, { items, page, limit, total });
});
exports.getPublicServiceBySlug = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { slug } = services_schema_1.slugParamSchema.parse(req.params);
    const doc = await Service_1.Service.findOne({ slug, isDeleted: false, isActive: true }).lean();
    if (!doc) {
        return res
            .status(404)
            .json({ success: false, error: { code: "NOT_FOUND", message: "Service not found" } });
    }
    return (0, response_1.ok)(res, { service: doc });
});
/* =========================
   ADMIN
========================= */
exports.adminListServices = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { q, page, limit, includeDeleted, isActive } = services_schema_1.adminListQuerySchema.parse(req.query);
    const skip = (page - 1) * limit;
    const filter = {};
    if (!includeDeleted)
        filter.isDeleted = false;
    if (typeof isActive === "boolean")
        filter.isActive = isActive;
    const sort = { order: 1, createdAt: -1 };
    if (q) {
        filter.$text = { $search: q };
        sort.score = { $meta: "textScore" };
        sort.order = 1;
    }
    const [items, total] = await Promise.all([
        Service_1.Service.find(filter).sort(sort).skip(skip).limit(limit).lean(),
        Service_1.Service.countDocuments(filter),
    ]);
    return (0, response_1.ok)(res, { items, page, limit, total });
});
exports.adminGetService = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = services_schema_1.mongoIdParamSchema.parse(req.params);
    const doc = await Service_1.Service.findById(id).lean();
    if (!doc) {
        return res
            .status(404)
            .json({ success: false, error: { code: "NOT_FOUND", message: "Service not found" } });
    }
    return (0, response_1.ok)(res, { service: doc });
});
exports.adminCreateService = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const body = services_schema_1.createServiceSchema.parse(req.body);
    const slug = body.slug ? normalizeSlug(body.slug) : normalizeSlug(body.title);
    const exists = await Service_1.Service.findOne({ slug, isDeleted: false }).select("_id").lean();
    if (exists) {
        return res
            .status(409)
            .json({ success: false, error: { code: "CONFLICT", message: "Slug already exists" } });
    }
    const doc = await Service_1.Service.create({
        ...body,
        slug,
        highlights: sortHighlights(body.highlights ?? []),
        seo: body.seo ?? { metaTitle: "", metaDescription: "", ogImageUrl: "" },
    });
    res.status(201);
    return (0, response_1.ok)(res, { service: doc });
});
exports.adminUpdateService = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = services_schema_1.mongoIdParamSchema.parse(req.params);
    const body = services_schema_1.updateServiceSchema.parse(req.body);
    const update = { ...body };
    if (typeof body.title === "string" && !body.slug) {
        update.slug = normalizeSlug(body.title);
    }
    if (typeof body.slug === "string") {
        update.slug = normalizeSlug(body.slug);
    }
    if (body.highlights) {
        update.highlights = sortHighlights(body.highlights);
    }
    if (update.slug) {
        const exists = await Service_1.Service.findOne({ slug: update.slug, _id: { $ne: id }, isDeleted: false })
            .select("_id")
            .lean();
        if (exists) {
            return res
                .status(409)
                .json({ success: false, error: { code: "CONFLICT", message: "Slug already exists" } });
        }
    }
    const doc = await Service_1.Service.findByIdAndUpdate(id, update, { new: true });
    if (!doc) {
        return res
            .status(404)
            .json({ success: false, error: { code: "NOT_FOUND", message: "Service not found" } });
    }
    return (0, response_1.ok)(res, { service: doc });
});
exports.adminDeleteService = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = services_schema_1.mongoIdParamSchema.parse(req.params);
    const doc = await Service_1.Service.findByIdAndUpdate(id, { isDeleted: true, isActive: false }, { new: true });
    if (!doc) {
        return res
            .status(404)
            .json({ success: false, error: { code: "NOT_FOUND", message: "Service not found" } });
    }
    return (0, response_1.ok)(res, { deleted: true });
});
exports.adminRestoreService = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = services_schema_1.mongoIdParamSchema.parse(req.params);
    const doc = await Service_1.Service.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
    if (!doc) {
        return res
            .status(404)
            .json({ success: false, error: { code: "NOT_FOUND", message: "Service not found" } });
    }
    return (0, response_1.ok)(res, { restored: true, service: doc });
});
//# sourceMappingURL=services.controller.js.map