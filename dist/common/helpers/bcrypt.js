"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePasswords = exports.hashPassword = void 0;
const bcrypt = require("bcryptjs");
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};
exports.hashPassword = hashPassword;
const comparePasswords = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};
exports.comparePasswords = comparePasswords;
//# sourceMappingURL=bcrypt.js.map