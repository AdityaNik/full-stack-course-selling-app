import { storage } from "@/lib/utils";
import { getDownloadURL, list, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";

const VideoScreen = () => {
  const { courseId, chapterId, lectureId, lectureTitle } = useParams();
  const [videoURL, setVideoURL] = useState("");

  const getVideo = async () => {
    const storageRef = ref(storage, `${courseId}/${chapterId}/${lectureId}`);
    const files = await list(storageRef);
    console.log(files);
    let newPath = "";
    for (const itemRef of files.items) {
      const fileURL = await getDownloadURL(itemRef);
      if (
        !(
          itemRef.name.endsWith(".png") ||
          itemRef.name.endsWith(".jpg") ||
          itemRef.name.endsWith(".jpeg")
        )
      ) {
        newPath = fileURL;
      }
    }
    console.log(newPath);
    setVideoURL(newPath);
  };

  useEffect(() => {
    getVideo();
  }, []);

  return (
    <div className="m-10">
      <div className="flex justify-center m-2">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {lectureTitle}
        </h3>
      </div>
      <div className="flex justify-center rounded-lg">
        <ReactPlayer
          url={videoURL}
          controls
          pip
          // light={downloadedThumbnailURL?.[lecture._id]}
        />
      </div>
    </div>
  );
};

export default VideoScreen;
