import { CardContent, Typography } from "@mui/material";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useRecoilValue } from "recoil";
import { purchasedCoursesState } from "./stores/atoms/purchasedCourses";
import { CourseProps } from "./Courses";
import { useNavigate } from "react-router-dom";

function Purchases() {
  const courseState = useRecoilValue(purchasedCoursesState);

  if (!courseState) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <Typography variant="h3">Loding....</Typography>
      </div>
    );
  } else {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Typography variant="h3" style={{ marginTop: 30 }}>
            Purchases
          </Typography>
        </div>
        <div className="flex m-10 justify-center gap-10 flex-wrap">
          {courseState.map((course) => {
            return (
              <div className="mb-10">
                <Course key={course._id} course={course} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

function Course({ course }: CourseProps) {
  const navigate = useNavigate();
  return (
    <Card>
      <CardContent>
        <Typography textAlign={"center"} variant="h5">
          {course.title}
        </Typography>
        <Typography textAlign={"center"} variant="subtitle1">
          {course.description}
        </Typography>
        <img
          className="w-[350px] h-[200px] rounded-lg m-2"
          src={course.imageLink}
        ></img>
        <div className="mt-4">
          <Button
            className="bg-orange-600 hover:bg-orange-800"
            size={"lg"}
            onClick={() => {
              navigate(`/courseContent/${course._id}`);
            }}
          >
            View Content
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default Purchases;
