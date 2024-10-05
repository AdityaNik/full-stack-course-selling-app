import express from 'express';
import mongoose from 'mongoose';
import { Admin, Course } from '../db/database';
import { adminGenerateJwt, ADMINAUTHENTICATIONJWT } from "../middleware/adminAuth";
import { z } from 'zod';

const router = express.Router();

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

export const UserType = z.object({
  username: z.string().min(1),
  password: z.string().min(1).max(6)
});

router.post('/signup', async (req, res) => {
  // logic to sign up admin
  const reqData = UserType.safeParse(req.body);
  if (!reqData.success) {
    res.status(411).json({ "messege": "Send valid username" });
    return;
  }
  let username = reqData.data.username;
  let password = reqData.data.password;
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

export const usernameType = z.string().min(1);
export const passwordType = z.string().min(1).max(6);

router.post('/login', async (req, res) => {
  // logic to log in admin
  const username = usernameType.safeParse(req.headers.username);
  const password = passwordType.safeParse(req.headers.password);

  if (!username.success || !password.success) {
    return res.status(403).json({ message: "Invalid username or password" });
  }
  let admin = await Admin.findOne({ username: username.data, password: password.data });
  if (admin) {
    let obj = { username: username.data, password: password.data };
    let jwtToken = adminGenerateJwt(obj);
    res.status(200).json({ message: "Login successfull", token: jwtToken });
  } else {
    res.status(403).json({ message: "Invalid username or password" });
  }
});

const CourseType = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(1),
  imageLink: z.string().min(1),
  published: z.boolean()
})

router.post('/courses', ADMINAUTHENTICATIONJWT, (req, res) => {
  // logic to create a course
  let course = CourseType.safeParse(req.body);
  if (!course.success) {
    return res.status(403).json({ message: "send right course properties" });
  }
  const newCourse = new Course(course.data);
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

router.post('/addChapter/:courseId', ADMINAUTHENTICATIONJWT, async (req, res) => {
  let checkObj = mongoose.isValidObjectId(req.params.courseId);
  if (checkObj) {
    const course = await Course.findById(req.params.courseId);
    if (course) {
      const id = new mongoose.Types.ObjectId;
      await Course.updateOne({ _id: req.params.courseId }, {
        $push: {
          chapters: { title: req.body.chapterTitle, _id: id }
        }
      });
      const updateCourse = await Course.findById(req.params.courseId);
      res.status(200).json({ chapter_id: id });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } else {
    res.status(404).json({ message: "Invalid course Id" });
  }
});


router.post('/addLeture/:courseId', ADMINAUTHENTICATIONJWT, async (req, res) => {
  let checkObj = mongoose.isValidObjectId(req.params.courseId);
  if (checkObj) {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const { chapterId, lectureTitle } = req.body;
    const chapter = course.chapters.id(chapterId);
    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }
    const newLession = {
      _id: new mongoose.Types.ObjectId,
      lectureTitle,
    }
    chapter.lectures.push(newLession);
    await course.save();
    res.status(200).json({
      "Chapter": newLession
    })
  }
})

router.get('/getChapter/:courseId', ADMINAUTHENTICATIONJWT, async (req, res) => {
  let checkObj = mongoose.isValidObjectId(req.params.courseId);
  if (checkObj) {
    const course = await Course.findById(req.params.courseId);
    if (course) {
      const courseChapter = await Course.findOne({ _id: req.params.courseId }).populate("chapters");
      res.status(200).json({ chapters: courseChapter?.chapters });
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
      let course = await Course.find();
      if (!course) {
        return res.status(403).json({ message: "something wrong happend" })
      }
      res.json({ message: "Course Deleted", courses: course });
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (e) {
    console.log(e);
  }
});

export default router;