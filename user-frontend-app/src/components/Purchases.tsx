import { Button, Card, Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import { purchasedCoursesState } from "./stores/atoms/purchasedCourses";
import { CourseProps } from "./Courses";

function Purchases() {
    const courseState = useRecoilValue(purchasedCoursesState);

    if (!courseState) {
        return <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
            <Typography variant="h3">
                Loding....
            </Typography>
        </div>
    } else {
        return <div>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Typography variant='h3' style={{ marginTop: 30 }}>
                    Purchases
                </Typography>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: 20, padding: 20 }}>
                {courseState.map((course) => {
                    return <div>
                        <Course key={course._id} course={course} />
                    </div>
                })}
            </div>
        </div>
    }
}

function Course({ course }: CourseProps) {

    return <Card style={{
        margin: 25,
        width: 300,
        minHeight: 200,
        padding: 20
    }}>
        <Typography textAlign={"center"} variant="h5">
            {course.title}
        </Typography>
        <Typography textAlign={"center"} variant="subtitle1">
            {course.description}
        </Typography>
        <img src={course.imageLink} style={{ width: 300 }}></img>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
            <Button variant="contained" size="large" onClick={() => {

            }}>View Content</Button>
        </div>
    </Card>
}

export default Purchases;