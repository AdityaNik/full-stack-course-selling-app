import { useRecoilValue, useSetRecoilState } from "recoil";
import { courseState } from "./stores/atoms/course";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../config";
import { useEffect, useState } from "react";
import {
  courseDescription,
  courseImageLink,
  coursePrice,
  courseTitle,
  isCourseLoading,
} from "./stores/selector/course";
import {
  CardContent,
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import Typography from "@mui/material/Typography";
import { Plus } from "lucide-react";
import { Label } from "./ui/label";
import {
  getDownloadURL,
  listAll,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../lib/utils";
import ReactPlayer from "react-player";

function EditCourse() {
  const setCourse = useSetRecoilState(courseState);
  const loading = useRecoilValue(isCourseLoading);
  const { courseId } = useParams();

  const populateCourse = async () => {
    const response = await axios.get(`${BASE_URL}/admin/courses/${courseId}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    if (response.data.course) {
      setCourse({
        isLoading: false,
        course: response.data.course,
      });
    }
  };

  useEffect(() => {
    populateCourse();
  }, []);

  if (loading) {
    return (
      <div>
        <Typography variant="h3">Loading...</Typography>
      </div>
    );
  }
  return (
    <div>
      <div className="flex justify-center m-10">
        <Typography variant="h3">Course Contents</Typography>
      </div>
      <div>
        <CourseCard />
      </div>
    </div>
  );
}

function CourseCard() {
  const title = useRecoilValue(courseTitle);
  const description = useRecoilValue(courseDescription);
  const price = useRecoilValue(coursePrice);
  const imageLink = useRecoilValue(courseImageLink);
  const [chapters, setChapters] = useState([{}]);
  const [chapterTitle, setChapterTitle] = useState("");
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [downloadedVideoURL, setDownloadedVideoURL] = useState({});
  const [downloadedThumbnailURL, setDownloadedThumbnailURL] = useState({});
  const [lectureTitle, setLectureTitle] = useState("");
  const { courseId } = useParams();

  const loadChapters = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getChapter/${courseId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });

      const fetchedChapters = res.data.chapters || [];
      setChapters(fetchedChapters);

      const chaptersWithLectures = await Promise.all(
        fetchedChapters.map(async (chapter) => {
          const lectures = await loadLessions(chapter.lectures, chapter._id);
          return { ...chapter, lectures };
        })
      );

      const videoURLs = {};
      const thumbnailURLs = {};

      chaptersWithLectures.forEach((chapter) => {
        chapter.lectures.forEach((lecture) => {
          videoURLs[lecture.lectureId] = lecture.videoURL;
          thumbnailURLs[lecture.lectureId] = lecture.thumbnailURL;
        });
      });

      setDownloadedVideoURL(videoURLs);
      setDownloadedThumbnailURL(thumbnailURLs);
    } catch (error) {
      console.error("Error loading chapters:", error);
    }
  };

  const addChapter = async () => {
    const res = await axios.post(
      `${BASE_URL}/admin/addChapter/${courseId}`,
      {
        chapterTitle: chapterTitle,
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    setChapters((prev) => [
      ...prev,
      { title: chapterTitle, _id: res.data.chapter_id },
    ]);
    loadChapters();
  };

  const loadLessions = async (lectures, chapterId) => {
    const lectureData = await Promise.all(
      lectures.map(async (lecture) => {
        const lectureId = lecture._id;
        const storageFolderRef = ref(
          storage,
          `${courseId}/${chapterId}/${lectureId}`
        );
        const fileList = await listAll(storageFolderRef);

        let videoURL = "";
        let thumbnailURL = "";
        for (const itemRef of fileList.items) {
          const fileURL = await getDownloadURL(itemRef);
          if (
            itemRef.name.endsWith(".jpg") ||
            itemRef.name.endsWith(".jpeg") ||
            itemRef.name.endsWith(".png")
          ) {
            thumbnailURL = fileURL;
          } else {
            videoURL = fileURL;
          }
        }
        return { lectureId, videoURL, thumbnailURL };
      })
    );
    return lectureData;
  };

  const upLoadFile = (id: any, lectureId: any, file: any) => {
    const storageRef = ref(
      storage,
      `${courseId}/${id}/${lectureId}/${file?.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        console.log(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("upload successfull" + downloadURL);
        });
      }
    );
  };

  const upload = async (id: any) => {
    const file = video;
    if (!file) return;

    const res = await axios.post(
      `${BASE_URL}/admin/addLeture/${courseId}`,
      {
        chapterId: id,
        lectureTitle,
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    upLoadFile(id, res.data.Chapter._id, file);
    upLoadFile(id, res.data.Chapter._id, thumbnail);
    loadChapters();
  };

  useEffect(() => {
    loadChapters();
  }, []);

  return (
    <div>
      <Card className="m-10">
        <CardContent>
          <div>
            <div className="flex m-10 gap-10">
              <div className="w-[250px] h-[150px]">
                <img
                  className="w-[250px] h-[150px] rounded-xl"
                  src={imageLink}
                ></img>
              </div>
              <div>
                <Typography textAlign={"center"} variant="h5">
                  {title}
                </Typography>
                <Typography textAlign={"center"} variant="subtitle1">
                  {description}
                </Typography>
                <div className="mt-8">
                  <Typography variant="h6" color={"Highlight"}>
                    {"$" + price}
                  </Typography>
                </div>
              </div>
            </div>
            <Separator className="my-8" />
            <div>
              <Card>
                <CardContent>
                  <CardTitle>
                    <div className="flex justify-between m-8">
                      <div>
                        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                          Add Contents
                        </h2>
                      </div>
                      <div>
                        <Dialog>
                          <DialogTrigger>
                            <Button size={"lg"}>Add Chapter</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <CardHeader>
                              <CardTitle>Add Chapter</CardTitle>
                              <CardDescription>
                                add chapters to your course
                              </CardDescription>
                            </CardHeader>
                            <div className="m-2 flex flex-col gap-4">
                              <Input
                                onChange={(e) => {
                                  setChapterTitle(e.target.value);
                                }}
                                placeholder="Enter chapter title"
                              />
                              <Button onClick={addChapter}>Add</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    <div>
                      <Card>
                        <CardContent>
                          {chapters.map((chapter) => {
                            return (
                              <div>
                                <div className="flex justify-between m-4">
                                  <div>
                                    <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                                      {chapter?.title}
                                    </h2>
                                  </div>
                                  <div>
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button size={"icon"}>
                                          <Plus />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <div className="grid w-full max-w-sm items-center gap-2">
                                          <Label htmlFor="videoFile">
                                            Lecture Title
                                          </Label>
                                          <Input
                                            id="title"
                                            onChange={(e) => {
                                              setLectureTitle(e.target.value);
                                            }}
                                          />
                                          <Label htmlFor="videoFile">
                                            Video Lecture
                                          </Label>
                                          <Input
                                            id="videoFile"
                                            type="file"
                                            accept="video/*"
                                            onChange={(e) => {
                                              setVideo(e.target.files[0]);
                                            }}
                                          />
                                          <Label htmlFor="picture">
                                            Thumbnail
                                          </Label>
                                          <Input
                                            id="picture"
                                            type="file"
                                            onChange={(e) => {
                                              setThumbnail(e.target.files[0]);
                                            }}
                                          />
                                        </div>
                                        <div>
                                          <Button
                                            onClick={() => {
                                              upload(chapter?._id);
                                            }}
                                          >
                                            Upload Lecture
                                          </Button>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                  {chapter?.lectures?.length > 0 ? (
                                    chapter?.lectures.map((lecture: any) => {
                                      return (
                                        <div className="mb-4 mx-4">
                                          <div className="border-black border-2 rounded-lg">
                                            <ReactPlayer
                                              url={
                                                downloadedVideoURL?.[
                                                  lecture._id
                                                ]
                                              }
                                              width={350}
                                              height={200}
                                              controls
                                              pip
                                              light={
                                                downloadedThumbnailURL?.[
                                                  lecture._id
                                                ]
                                              }
                                            />
                                          </div>
                                          <div>
                                            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                                              {lecture.lectureTitle}
                                            </h3>
                                          </div>
                                        </div>
                                      );
                                    })
                                  ) : (
                                    <p>No Lectures Available</p>
                                  )}
                                </div>
                                <Separator className="my-8" />
                              </div>
                            );
                          })}
                        </CardContent>
                      </Card>
                    </div>
                  </CardTitle>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EditCourse;
