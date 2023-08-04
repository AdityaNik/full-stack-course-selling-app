import express from 'express';
import mongoose from 'mongoose';
import { Admin, Course } from '../db/database';
import { adminGenerateJwt, ADMINAUTHENTICATIONJWT } from "../middleware/adminAuth";

const router = express.Router();

interface Course {
    titile: String,
    description: String,
    price: Number,
    imageLink: String,
    published: Boolean
}

// Admin routes
router.get('/me', ADMINAUTHENTICATIONJWT, async (req, res) => {
    const admin = await Admin.findOne({ username: req.headers["user"] });
    if (!admin) {
        res.status(403).json({ msg: "Admin doesnt exist" })
        return
    }
    res.json({
        username: admin.username
    });
});

router.post('/signup', async (req, res) => {
    // logic to sign up admin
    let { username, password } = req.body;
    let admin = await Admin.findOne({ username, password });
    if (admin) {
        res.status(403).json({ message: "Admin already exits" });
    } else {
        let obj = { username: username, password: password };
        let jwtToken = adminGenerateJwt(obj);
        const newAdmin = new Admin(obj);
        newAdmin.save();
        res.status(200).json({ message: "Admin created Successfully", token: jwtToken });
    }
});

router.post('/login', async (req, res) => {
    // logic to log in admin
    const username = req.headers.username as string | undefined;
    const password = req.headers.password as string | undefined;

    if (!username || !password) {
        return res.status(403).json({ message: "Invalid username or password" });
    }
    let admin = await Admin.findOne({ username, password });
    if (admin) {
        let obj = { username: username, password: password };
        let jwtToken = adminGenerateJwt(obj);
        res.status(200).json({ message: "Login successfull", token: jwtToken });
    } else {
        res.status(403).json({ message: "Invalid username or password" });
    }
});

router.post('/courses', ADMINAUTHENTICATIONJWT, (req, res) => {
    // logic to create a course
    let course: Course = req.body;
    const newCourse = new Course(course);
    newCourse.save();
    res.status(200).json({ message: "Course created", id: newCourse.id });
});

router.put('/courses/:courseId', ADMINAUTHENTICATIONJWT, async (req, res) => {
    let checkObj = mongoose.isValidObjectId(req.params.courseId);
    if (checkObj) {
        const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
        if (course) {
            res.json({ message: 'Course updated successfully' });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } else {
        res.status(404).json({ message: "Invalid course Id" });
    }
});

router.get('/courses', ADMINAUTHENTICATIONJWT, async (req, res) => {
    // logic to get all courses
    let courses = await Course.find();
    res.status(200).json({ courses: courses });
});

router.get('/courses/:courseId', ADMINAUTHENTICATIONJWT, async (req, res) => {
    // login to get a course
    let courseId = req.params.courseId;
    if (courseId) {
        try {
            let course = await Course.findById(courseId);
            if (course) {
                res.json({ course: course });
            } else {
                res.status(404).json({ message: "Course not found" });
            }
        } catch (e) {
            console.log(e);
        }
    }
});

router.delete('/courses/:courseId', ADMINAUTHENTICATIONJWT, async (req, res) => {
    //login to delete a course
    let courseId = req.params.courseId;
    try {
        const response = await Course.findByIdAndDelete(courseId);
        if (response) {
            res.json({ message: "Course Deleted", courses: response });
        } else {
            res.status(404).json({ message: "Course not found" });
        }
    } catch (e) {
        console.log(e);
    }
});


export default router;