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
const express_1 = __importDefault(require("express"));
const userAuth_1 = require("../middleware/userAuth");
const database_1 = require("../db/database");
const admin_1 = require("./admin");
const router = express_1.default.Router();
// User routes
router.get('/me', userAuth_1.USERAUTHENTICATIONJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield database_1.User.findOne({ username: req.headers["user"] });
    if (!user) {
        res.status(403).json({ msg: "User doesnt exist" });
        return;
    }
    res.json({
        username: user.username
    });
}));
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to sign up user
    const reqData = admin_1.UserType.safeParse(req.body);
    if (!reqData.success) {
        res.status(411).json({ messege: "Send valid username" });
        return;
    }
    let username = reqData.data.username;
    let password = reqData.data.password;
    let user = yield database_1.User.findOne({ username: username, password: password });
    if (user) {
        res.status(403).json({ message: "User already exits" });
    }
    else {
        let obj = { username: username, password: password };
        let jwtToken = (0, userAuth_1.userGenerateJwt)(obj);
        const newUser = new database_1.User(obj);
        newUser.save();
        res.status(200).json({ message: "User created Successfully", token: jwtToken });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to log in user
    const username = admin_1.usernameType.safeParse(req.headers.username);
    const password = admin_1.passwordType.safeParse(req.headers.password);
    if (!username.success || !password.success) {
        return res.status(403).json({ message: "Invalid username or password" });
    }
    let user = yield database_1.User.findOne({ username: username.data, password: password.data });
    if (user) {
        let obj = { username: username.data, password: password.data };
        let jwtToken = (0, userAuth_1.userGenerateJwt)(obj);
        res.status(200).json({ message: "Login successfull", token: jwtToken });
    }
    else {
        res.status(403).json({ message: "Invalid username or password" });
    }
}));
router.get('/courses', userAuth_1.USERAUTHENTICATIONJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to list all courses
    let courses = yield database_1.Course.find({ published: true });
    res.status(200).json({ courses: courses });
}));
router.get('/admin/courses/:courseId', userAuth_1.USERAUTHENTICATIONJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // login to get a course
    let courseId = req.params.courseId;
    if (courseId) {
        let course = yield database_1.Course.findById(courseId);
        if (course) {
            res.json({ course: course });
        }
        else {
            res.status(404).json({ message: "Course not found" });
        }
    }
}));
router.post('/courses/:courseId', userAuth_1.USERAUTHENTICATIONJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to purchase a course
    let course = yield database_1.Course.findById(req.params.courseId);
    // console.log(course);
    if (course) {
        let user = yield database_1.User.findOne({ username: req.headers["user"] });
        if (user) {
            user.purchasedCourses.push(course._id);
            yield user.save();
            res.json({ message: "Course Purchases", course: course });
        }
        else {
            res.status(403).json({ message: "User not found" });
        }
    }
    else {
        res.status(404).json({ message: "Course not found" });
    }
}));
router.get('/purchasedCourses', userAuth_1.USERAUTHENTICATIONJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to view purchased courses
    let user = yield database_1.User.findOne({ username: req.headers["user"] }).populate("purchasedCourses");
    if (user) {
        res.json({ purchasedCourses: user.purchasedCourses });
    }
    else {
        res.status(403).json({ message: "user not found" });
    }
}));
exports.default = router;
