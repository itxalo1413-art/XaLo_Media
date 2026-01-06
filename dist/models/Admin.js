"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const mongoose_1 = require("mongoose");
const AdminSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    refreshTokenHash: { type: String, default: null },
}, { timestamps: true });
exports.Admin = (0, mongoose_1.model)("Admin", AdminSchema);
//# sourceMappingURL=Admin.js.map