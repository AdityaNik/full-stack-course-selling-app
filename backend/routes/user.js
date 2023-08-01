const mongoose = require("mongoose");
const express = require('express');
const { USERAUTHENTICATIONJWT, userGenerateJwt } = require('../middleware/userAuth');
const { User, Course } = require('../db/database');

const router = express.Router();

// User routes
router.get('/me', USERAUTHENTICATIONJWT, async (req, res) => {
    const user = await User.findOne({ username: req.user.username });
    if (!user) {
        res.status(403).json({ msg: "User doesnt exist" })
        return
    }
    res.json({
        username: user.username
    })
});

router.post('/signup', async (req, res) => {
    // logic to sign up user
    let { username, password } = req.body;
    let user = await User.findOne({ username, password });
    if (user) {
        res.status(403).json({ message: "User already exits" });
    } else {
        let obj = { username: username, password: password };
        let jwtToken = userGenerateJwt(obj);
        const newUser = new User(obj);
        newUser.save();
        res.status(200).json({ message: "User created Successfully", token: jwtToken });
    }
});

router.post('/login', async (req, res) => {
    // logic to log in user
    let { username, password } = req.headers;
    let user = await User.findOne({ username, password });
    if (user) {
        let obj = { username: username, password: password };
        let jwtToken = userGenerateJwt(obj);
        res.status(200).json({ message: "Login successfull", token: jwtToken });
    } else {
        res.status(403).json({ message: "Invalid username or password" });
    }
});

router.get('/courses', USERAUTHENTICATIONJWT, async (req, res) => {
    // logic to list all courses
    let courses = await Course.find({ published: true });
    res.status(200).json({ courses: courses });
});

router.get('/admin/courses/:courseId', USERAUTHENTICATIONJWT, async (req, res) => {
    // login to get a course
    let courseId = req.params.courseId;
    if (courseId) {
        let course = await Course.findById(courseId);
        if (course) {
            res.json({ course: course });
        } else {
            res.status(404).json({ message: "Course not found" });
        }
    }
});

router.post('/courses/:courseId', USERAUTHENTICATIONJWT, async (req, res) => {
    // logic to purchase a course
    let course = await Course.findById(req.params.courseId);
    // console.log(course);
    if (course) {
        let user = await User.findOne({ username: req.user.username });
        if (user) {
            user.purchasedCourses.push(course);
            await user.save();
            res.json({ message: "Course Purchases", course: course });
        } else {
            res.status(403).json({ message: "User not found" });
        }
    } else {
        res.status(404).json({ message: "Course not found" });
    }
});

router.get('/purchasedCourses', USERAUTHENTICATIONJWT, async (req, res) => {
    // logic to view purchased courses
    let user = await User.findOne({ username: req.user.username }).populate("purchasedCourses");
    if (user) {
        res.json({ purchasedCourses: user.purchasedCourses });
    } else {
        res.status(403).json({ message: "user not found" });
    }
});


module.exports = router