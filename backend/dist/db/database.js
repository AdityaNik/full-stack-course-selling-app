"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = exports.User = exports.Admin = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
//defining mongo schemas
const adminSchema = new mongoose_1.default.Schema({
    username: String,
    password: String
});
const userSchema = new mongoose_1.default.Schema({
    username: String,
    password: String,
    purchasedCourses: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Course" }]
});
const courseSchema = new mongoose_1.default.Schema({
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    published: Boolean,
    chapters: [{ title: String, lectures: [], }]
});
//Defining mongoose model
exports.Admin = mongoose_1.default.model("Admin", adminSchema);
exports.User = mongoose_1.default.model("User", userSchema);
exports.Course = mongoose_1.default.model('Course', courseSchema);
