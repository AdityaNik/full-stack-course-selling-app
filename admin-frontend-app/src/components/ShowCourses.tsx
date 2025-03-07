import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { BASE_URL } from "../config";
import { Course } from "./stores/atoms/course";

function ShowCourses() {
  const [courses, setCourses] = useState<Course[]>([]);

  const populateCourses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/courses`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      if (response.data.courses) {
        console.log(response.data.courses)
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
                  <CourseComponent
                    key={course._id}
                    course={course}
                    setCourses={setCourses}
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

interface CoursePropType {
  course: Course;
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
}

function CourseComponent({ course, setCourses }: CoursePropType) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card
      style={{
        margin: 25,
        width: 350,
        minHeight: 200,
        padding: 15,
      }}
    >
      <Typography textAlign={"center"} variant="h5">
        {course.title}
      </Typography>
      <Typography textAlign={"center"} variant="subtitle1">
        {course.description}
      </Typography>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img src={course.imageLink} style={{ width: 300 }}></img>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
        <Button
          variant="contained"
          onClick={() => {
            navigate(`/courses/${course._id}`);
          }}
        >
          Explore Content
        </Button>
        <Button
          variant="contained"
          onClick = {() => {
            handleClickOpen()
          }}
        >
          Delete
        </Button>
        <div>
          
        <Dialog open={open} onClose={handleClose} fullWidth={true}>
          <DialogTitle>Subscribe</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Type 'DELETE' to delete the course
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="conformation"
              label="Confirm"
              type="text"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={async () => {
                let confirm = document.getElementById("conformation");
                if (
                  confirm !== null &&
                  confirm instanceof HTMLInputElement &&
                  confirm.value === "DELETE"
                ) {
                  console.log(course._id);
                  const response = await axios.delete(
                    `${BASE_URL}/admin/courses/${course._id}`,
                    {
                      headers: {
                        Authorization: localStorage.getItem("token"),
                      },
                    }
                  );
                  if (response.data) {
                    console.log(response.data);
                    setCourses(response.data.courses);
                  }
                } else {
                  alert("Type correctely");
                }
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        </div>
      </div>
    </Card>
  );
}

export default ShowCourses;
