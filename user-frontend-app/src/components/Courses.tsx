import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { PurchasedCourse } from "./stores/atoms/purchasedCourses";
import { CardContent, Card, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Typography } from "@mui/material";

function Courses() {
  const [courses, setCourses] = useState<PurchasedCourse[]>([]);

  const populateCourses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/courses`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      if (response.data.courses) {
        setCourses(response.data.courses);
      }
    } catch (err) {}
  };

  useEffect(() => {
    populateCourses();
  }, []);

  if (!courses) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <Typography variant="h3">Loding....</Typography>
      </div>
    );
  } else {
    return (
      <div>
        <div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="h3" style={{ marginTop: 30 }}>
              Courses
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: 10,
            }}
          >
            {courses.map((course) => {
              return (
                <div>
                  <Course
                    key={course._id}
                    course={course}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export interface CourseProps {
  key: string;
  course: PurchasedCourse;
}

function Course({ course }: CourseProps) {
  const navigate = useNavigate();

  return (
    <div className="flex">
      <Card>
        <CardContent>
          <CardTitle>
            <div className="mt-2">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                {course.title}
              </h3>
            </div>
          </CardTitle>
          <div>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              {course.description}
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
        <img src={course.imageLink} style={{ width: 300 }}></img>
      </div>
          <div className="flex justify-between my-4">
            <Button
              className="bg-orange-600 hover:bg-orange-800"
              size={"lg"}
              onClick={() => {
                navigate("/course/" + course._id);
              }}
            >
              Explore
            </Button>
            <div>by Jon Doe</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Courses;
