import express from 'express';
import { USERAUTHENTICATIONJWT, userGenerateJwt } from '../middleware/userAuth';
import { User, Course } from '../db/database';
import { UserType, passwordType, usernameType } from './admin';
import mongoose from 'mongoose';

const router = express.Router();

// User routes
router.get('/me', USERAUTHENTICATIONJWT, async (req, res) => {
  const user = await User.findOne({ username: req.headers["user"] });
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
  const reqData = UserType.safeParse(req.body);
  if (!reqData.success) {
    res.status(411).json({ messege: "Send valid username" });
    return;
  }
  let username = reqData.data.username;
  let password = reqData.data.password;
  let user = await User.findOne({ username: username, password: password });
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
  const username = usernameType.safeParse(req.headers.username);
  const password = passwordType.safeParse(req.headers.password);

  if (!username.success || !password.success) {
    return res.status(403).json({ message: "Invalid username or password" });
  }
  let user = await User.findOne({ username: username.data, password: password.data });
  if (user) {
    let obj = { username: username.data, password: password.data };
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

router.get('/courses/:courseId', USERAUTHENTICATIONJWT, async (req, res) => {
  // login to get a course
  let courseId = req.params.courseId;
  if (mongoose.isValidObjectId(courseId)) {
    console.log("hello al");
    if (courseId) {
      let course = await Course.findById(courseId);
      if (course) {
        res.json({ course: course });
      } else {
        res.status(404).json({ message: "Course not found" });
      }
    }
  } else {
    res.status(404).json({
      "msg": "Invalid course id"
    })
  }
});

router.post('/purchaseCourse/:courseId', USERAUTHENTICATIONJWT, async (req, res) => {
  // logic to purchase a course
  let course = await Course.findById(req.params.courseId);
  // console.log(course);
  if (course) {
    let user = await User.findOne({ username: req.headers["user"] });
    if (user) {
      user.purchasedCourses.push(course._id);
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
  let user = await User.findOne({ username: req.headers["user"] }).populate("purchasedCourses");
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses });
  } else {
    res.status(403).json({ message: "user not found" });
  }
});


export default router;