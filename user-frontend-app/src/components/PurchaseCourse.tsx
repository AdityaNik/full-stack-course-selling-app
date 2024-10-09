import { Alert, Grid, Snackbar, TextField, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  PurchasedCourse,
  purchasedCoursesState,
} from "./stores/atoms/purchasedCourses";
import { BASE_URL } from "../config";
import { useRecoilState } from "recoil";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

const Course: PurchasedCourse = {
  title: "",
  description: "",
  price: -1,
  imageLink: "",
  published: false,
  _id: "-1",
};

function PurchaseCourse() {
  const { courseId } = useParams();
  const [course, setCourse] = useState({});
  const [open, setOpen] = useState<boolean>(false);
  const [courseState, setCourseState] = useRecoilState(purchasedCoursesState);
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
  };

  const init = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/users/courses/${courseId}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (response.data.course) {
        console.log(response.data.course);

        setCourse(response.data.course);
      } else {
        setCourse(Course);
      }
    } catch (e) {
      console.log(e);
      setCourse(Course);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const onPress = async () => {
    const response = await axios.post(
      `${BASE_URL}/users/purchaseCourse/${courseId}`,
      {},
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    if (response.data.course) {
      setCourseState((prevArray) => [...prevArray, course]);
      setOpen(true);
    }
  };

  const check = () => {
    if (courseId != undefined) {
      let course = courseState.find(
        (course) => parseInt(course._id) === parseInt(courseId)
      );
      return course;
    }
  };

  if (!course) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <Typography variant="h3">Loding....</Typography>
      </div>
    );
  } else {
    return (
      <div className="mb-10">
        <div>
          <div className="ml-32 mt-10">
            <div className="flex justify-center m-4">
              <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                {course.title}
              </h2>
            </div>
            <div className="flex justify-center">
              <img
                className="w-[500px] h-[350px] rounded-lg"
                src={course.imageLink}
                alt=""
              />
            </div>
          </div>
          <div className="flex flex-col justify-center gap-10 m-12">
            {/* {course.chapter[0].title} */}
            {course?.chapters && course?.chapters.length > 0 ? (
              course?.chapters.map((chapter) => (
                <div>
                  <Card className="m-4">
                    <CardContent>
                      <div className="m-4">
                        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                          {chapter.title}
                        </h2>
                        <div>
                          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                            Lectures:
                          </h4>
                        </div>
                      </div>
                      <div className="m-4">
                        {chapter.lectures.map((lec) => {
                          return (
                            <div className="border-b m-4">
                              <p className="leading-7 [&:not(:first-child)]:mt-6">
                                {lec.lectureTitle}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))
            ) : (
              <div>No chapters added yet</div>
            )}
          </div>
          {!check() ? (
            <div className="flex justify-end mr-12">
              <Button
                className="bg-orange-600 hover:bg-orange-800"
                size={"lg"}
                onClick={onPress}
              >
                Purchase
              </Button>
            </div>
          ) : (
            <div className="flex justify-end mr-12 gap-4">
              <Button className="bg-green-600 hover:bg-green-800" size={"lg"}>
                Purchased
              </Button>
              <Button
                className="bg-orange-600 hover:bg-orange-800"
                size={"lg"}
                onClick={() => {
                  navigate(`/courseContent/${courseId}`);
                }}
              >
                View Content
              </Button>
            </div>
          )}
        </div>
        {/* <div>
          <Grid container style={{ padding: "5vh" }}>
            <Grid item lg={6} md={12} sm={12}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingTop: 140,
                }}
              >
                <img src={course.imageLink} style={{ width: 400 }}></img>
              </div>
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingTop: 100,
                }}
              >
                <Card
                  style={{
                    padding: 30,
                    margin: 20,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Typography variant="h5">{course.title}</Typography>
                  </div>
                  <TextField
                    fullWidth={true}
                    aria-readonly
                    id="filled-read-only-input"
                    label="title"
                    value={course.title}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="filled"
                    style={{ marginTop: 25 }}
                  />
                  <TextField
                    fullWidth={true}
                    id="filled-read-only-input"
                    label="Description"
                    value={course.description}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="filled"
                    style={{ marginTop: 20 }}
                  />

                  {!check() ? (
                    <div style={{ paddingTop: 25 }}>
                      <Button
                        variant="contained"
                        onClick={() => {
                          onPress();
                        }}
                      >
                        {"$ @" + course.price}
                      </Button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", paddingTop: 25 }}>
                      <Button
                        style={{ width: 100, marginRight: 10 }}
                        color="success"
                        onClick={() => {}}
                      >
                        Purchased
                      </Button>
                      <Button onClick={() => {}}>View Content</Button>
                    </div>
                  )}
                  <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                  >
                    <Alert
                      onClose={handleClose}
                      severity="success"
                      sx={{ width: "100%" }}
                    >
                      Course Purchased
                    </Alert>
                  </Snackbar>
                </Card>
              </div>
            </Grid>
          </Grid>
        </div> */}
      </div>
    );
  }
}

export default PurchaseCourse;
