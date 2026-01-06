"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSlug = makeSlug;
exports.ensureUniqueSlug = ensureUniqueSlug;
const slugify_1 = __importDefault(require("slugify"));
function makeSlug(input) {
    return (0, slugify_1.default)(input, { lower: true, strict: true, trim: true });
}
// model = Mongoose model; excludeId để update không tính chính nó
async function ensureUniqueSlug(model, baseSlug, excludeId) {
    let slug = baseSlug;
    let i = 1;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const query = { slug };
        if (excludeId)
            query._id = { $ne: excludeId };
        const exists = await model.findOne(query).select("_id").lean();
        if (!exists)
            return slug;
        i += 1;
        slug = `${baseSlug}-${i}`;
    }
}
//# sourceMappingURL=slug.js.map