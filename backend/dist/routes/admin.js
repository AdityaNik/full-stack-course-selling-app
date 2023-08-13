"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordType = exports.usernameType = exports.UserType = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const database_1 = require("../db/database");
const adminAuth_1 = require("../middleware/adminAuth");
const zod_1 = require("zod");
const router = express_1.default.Router();
// Admin routes
router.get('/me', adminAuth_1.ADMINAUTHENTICATIONJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield database_1.Admin.findOne({ username: req.headers["user"] });
    if (!admin) {
        res.status(403).json({ msg: "Admin doesnt exist" });
        return;
    }
    res.json({
        username: admin.username
    });
}));
exports.UserType = zod_1.z.object({
    username: zod_1.z.string().min(1),
    password: zod_1.z.string().min(1).max(6)
});
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to sign up admin
    const reqData = exports.UserType.safeParse(req.body);
    if (!reqData.success) {
        res.status(411).json({ "messege": "Send valid username" });
        return;
    }
    let username = reqData.data.username;
    let password = reqData.data.password;
    let admin = yield database_1.Admin.findOne({ username, password });
    if (admin) {
        res.status(403).json({ message: "Admin already exits" });
    }
    else {
        let obj = { username: username, password: password };
        let jwtToken = (0, adminAuth_1.adminGenerateJwt)(obj);
        const newAdmin = new database_1.Admin(obj);
        newAdmin.save();
        res.status(200).json({ message: "Admin created Successfully", token: jwtToken });
    }
}));
exports.usernameType = zod_1.z.string().min(1);
exports.passwordType = zod_1.z.string().min(1).max(6);
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to log in admin
    const username = exports.usernameType.safeParse(req.headers.username);
    const password = exports.passwordType.safeParse(req.headers.password);
    if (!username.success || !password.success) {
        return res.status(403).json({ message: "Invalid username or password" });
    }
    let admin = yield database_1.Admin.findOne({ username: username.data, password: password.data });
    if (admin) {
        let obj = { username: username.data, password: password.data };
        let jwtToken = (0, adminAuth_1.adminGenerateJwt)(obj);
        res.status(200).json({ message: "Login successfull", token: jwtToken });
    }
    else {
        res.status(403).json({ message: "Invalid username or password" });
    }
}));
const CourseType = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    price: zod_1.z.number().min(1),
    imageLink: zod_1.z.string().min(1),
    published: zod_1.z.boolean()
});
router.post('/courses', adminAuth_1.ADMINAUTHENTICATIONJWT, (req, res) => {
    // logic to create a course
    let course = CourseType.safeParse(req.body);
    if (!course.success) {
        return res.status(403).json({ message: "send right course properties" });
    }
    const newCourse = new database_1.Course(course.data);
    newCourse.save();
    res.status(200).json({ message: "Course created", id: newCourse.id });
});
router.put('/courses/:courseId', adminAuth_1.ADMINAUTHENTICATIONJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let checkObj = mongoose_1.default.isValidObjectId(req.params.courseId);
    if (checkObj) {
        const course = yield database_1.Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
        if (course) {
            res.json({ message: 'Course updated successfully' });
        }
        else {
            res.status(404).json({ message: 'Course not found' });
        }
    }
    else {
        res.status(404).json({ message: "Invalid course Id" });
    }
}));
router.get('/courses', adminAuth_1.ADMINAUTHENTICATIONJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to get all courses
    let courses = yield database_1.Course.find();
    res.status(200).json({ courses: courses });
}));
router.get('/courses/:courseId', adminAuth_1.ADMINAUTHENTICATIONJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // login to get a course
    let courseId = req.params.courseId;
    if (courseId) {
        try {
            let course = yield database_1.Course.findById(courseId);
            if (course) {
                res.json({ course: course });
            }
            else {
                res.status(404).json({ message: "Course not found" });
            }
        }
        catch (e) {
            console.log(e);
        }
    }
}));
router.delete('/courses/:courseId', adminAuth_1.ADMINAUTHENTICATIONJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //login to delete a course
    let courseId = req.params.courseId;
    try {
        const response = yield database_1.Course.findByIdAndDelete(courseId);
        if (response) {
            let course = yield database_1.Course.find();
            if (!course) {
                return res.status(403).json({ message: "something wrong happend" });
            }
            res.json({ message: "Course Deleted", courses: course });
        }
        else {
            res.status(404).json({ message: "Course not found" });
        }
    }
    catch (e) {
        console.log(e);
    }
}));
exports.default = router;
