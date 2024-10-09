import { BASE_URL } from "@/config";
import { storage } from "@/lib/utils";
import axios from "axios";
import { getDownloadURL, list, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { CardContent } from "@mui/material";

type Thumbnail = {
  _id: string;
  link: string;
};

const Lectures = () => {
  const { courseId, chapterId } = useParams();
  const [chapter, setChapter] = useState({});
  const [thumbnails, setThumbnail] = useState<Thumbnail[]>([]);
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
      // console.log(response.data.course.chapters);
      // console.log(chapterId);

      if (response.data.course) {
        const ch = response.data.course.chapters.filter(
          (chapter) => chapter._id == chapterId
        );
        setChapter(ch[0]);
      } else {
        setChapter({});
      }
    } catch (e) {
      console.log(e);
      setChapter({});
    }
  };

  const getThumbnails = async () => {
    console.log(chapter);

    const folderRef = ref(storage, `${courseId}/${chapter._id}`);
    const folderlist = await list(folderRef);
    console.log(folderlist);
    let thumbnailArray: Thumbnail[] = [];
    for (let i = 0; i < folderlist.prefixes.length; i++) {
      const thumbnailPath = folderlist.prefixes[i]._location.path_;
      const storageRef = ref(storage, thumbnailPath);
      const files = await list(storageRef);
      for (let j = 0; j < files.items.length; j++) {
        // console.log(files.items[j]._location.path_);
        if (
          files.items[j]?._location.path_.endsWith(".jpg") ||
          files.items[j]?._location.path_.endsWith(".jpeg") ||
          files.items[j]?._location.path_.endsWith(".png")
        ) {
          const thumbnail = ref(storage, files.items[j]?._location.path_);
          const finalThumbnail = await getDownloadURL(thumbnail);
          const idWalaArray = thumbnail.fullPath.split("/");
          thumbnailArray.push({ _id: idWalaArray[2], link: finalThumbnail });
        }
      }
    }

    // console.log(idWalaArray[2]);
    setThumbnail(thumbnailArray);
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (chapter) {
      setThumbnail([]);
      getThumbnails();
    }
  }, [chapter]);

  return (
    <div className="m-10 m">
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {chapter.title}
      </h2>
      <div className="flex flex-wrap gap-8 cursor-pointer">
        {chapter.lectures &&
          chapter.lectures.map((chap) => {
            const matchingThumbnail = thumbnails.find(
              (thumbnail) => thumbnail._id === chap._id
            );

            return (
              <div
                key={chap._id}
                onClick={() => {
                  navigate(
                    `/lecture/${courseId}/${chapterId}/${chap._id}/${chap.lectureTitle}`
                  );
                }}
              >
                {matchingThumbnail ? (
                  <div>
                    <Card>
                      <CardContent>
                        <img
                          className="w-[350px] h-[200px]"
                          src={matchingThumbnail.link}
                          alt={chap.title} // Use a more descriptive alt text
                        />
                      </CardContent>
                    </Card>
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                      {chap.lectureTitle}
                    </h4>
                  </div>
                ) : (
                  <div>No Thumbnail Available</div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Lectures;
