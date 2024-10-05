import React from "react";
import {
  Card,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function CreateCourse() {
  const [title, setTitle] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [price, setPrice] = React.useState<number>(0);
  const [imageLink, setImageLink] = React.useState<string>("");
  const [published, setPublished] = React.useState<boolean>(true);
  const navigate = useNavigate();

  return (
    <div>
      <div
        style={{ display: "flex", justifyContent: "center", paddingTop: 50 }}
      >
        <Card
          variant="outlined"
          style={{
            width: 450,
            height: "auto",
            border: "1px solid black",
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingBottom: 20,
            }}
          >
            <Typography variant="h4">Create Course</Typography>
          </div>
          <div style={{ marginTop: 20 }}>
            <TextField
              fullWidth={true}
              label="Title"
              variant="outlined"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>

          <div style={{ marginTop: 20 }}>
            <TextField
              fullWidth={true}
              label="Description"
              variant="outlined"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </div>

          <div style={{ marginTop: 20 }}>
            <TextField
              fullWidth={true}
              label="ImageLink"
              variant="outlined"
              onChange={(e) => {
                setImageLink(e.target.value);
              }}
            />
          </div>

          <div style={{ marginTop: 20 }}>
            <TextField
              fullWidth={true}
              label="Price"
              variant="outlined"
              type="number"
              onChange={(e) => {
                setPrice(parseInt(e.target.value));
              }}
            />
          </div>

          <div style={{ marginTop: 20 }}>
            <TextField
              fullWidth={true}
              label="Lecturer"
              variant="outlined"
              type="text"
              onChange={(e) => {
                setPrice(parseInt(e.target.value));
              }}
            />
          </div>

          <div style={{ marginTop: 25 }}>
            <Button
              style={{ width: 130, height: 40 }}
              variant="contained"
              onClick={() => {
                if (title === "" || description === "" || price === 0) {
                  return;
                }

                axios
                  .post(
                    "http://localhost:3000/admin/courses",
                    {
                      title: title,
                      description: description,
                      price: price,
                      imageLink: imageLink,
                      published: published,
                    },
                    {
                      headers: {
                        Authorization: localStorage.getItem("token"),
                        "Content-Type": "application/json",
                      },
                    }
                  )
                  .then((res) => {
                    console.log(res.data);
                    if (res.status === 200) {
                      alert("Course Created");
                      navigate("/courses");
                    }
                  });
              }}
            >
              <Typography>Create</Typography>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
export default CreateCourse;
