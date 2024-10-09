import { BASE_URL } from "@/config";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "./ui/card";

const CourseContent = () => {
  const [course, setCourse] = useState({});
  const { courseId } = useParams();
  const navigate = useNavigate();

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
        setCourse({});
      }
    } catch (e) {
      console.log(e);
      setCourse({});
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="flex flex-wrap justify-center m-10 gap-8">
      {course?.chapters && course?.chapters.length > 0 ? (
        course?.chapters.map((chapter) => (
          <div
            className="cursor-pointer"
            onClick={() => {
              navigate(`/lectures/${courseId}/${chapter._id}`);
            }}
          >
            <Card className="w-[350px] h-[200px]">
              <CardContent>
                <img
                  className="w-full h-[200px]"
                  src="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20230128123255/12-Best-Full-Stack-Projects-Ideas-in-2023.png"
                  alt=""
                />
              </CardContent>
            </Card>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              {chapter.title}
            </h4>
          </div>
        ))
      ) : (
        <div>No chapters added yet</div>
      )}
    </div>
  );
};

export default CourseContent;
