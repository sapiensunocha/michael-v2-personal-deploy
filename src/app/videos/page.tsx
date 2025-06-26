"use client";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { BiPlus } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { IoSearch } from "react-icons/io5";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";
import Container from "../../components/ui/container";
import { getCategories } from "../../redux/services/category";
import { getGenres } from "../../redux/services/genre";
import VideoContainer from "./videoWrapper";

interface VideoData {
  videoTitle: string;
  videoUrl: CloudinaryResponse;
  videoDescription: string;
  views: number;
  tags: string[];
  videoCategory: string;
  videoDuration: number;
  videoRelease: Date;
  videoGenre: string;
  thumbnail: CloudinaryResponse;
  userId: string;
}

interface CloudinaryResponse {
  URL?: string;
  publicID?: string;
}

interface CreateVideoModalProps {
  onClose: () => void;
}

interface VideoCategory {
  _id: string;
  name: string;
}

interface VideoGenre {
  _id: string;
  name: string;
}

const Videos = () => {
  return (
    <Container>
      <Suspense fallback={<div>Loading...</div>}>
        <VideosContent />
      </Suspense>
    </Container>
  );
};

const VideosContent = () => {
  const params = useSearchParams();
  const router = useRouter();
  const id = params?.get("id");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="w-full border-b z-50">
        <div className="flex items-center justify-between px-6 py-2">
          {/* <div className="w-full max-w-2xl">
            <div className="flex items-center bg-white rounded-full px-4 md:py-2">
              <IoSearch className="text-gray-500 text-2xl" />
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent placeholder:italic placeholder:text-sm w-full border-none outline-none"
              />
            </div>
          </div> */}
          <div className="flex items-center gap-4">
            {/* <div
              className="flex md:bg-michael_red_100 text-white items-center gap-2 md:px-4 px-2 md:py-2 py-0 rounded cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <BiPlus />
              <span className="md:block hidden">Create</span>
            </div> */}
          </div>
        </div>
      </header>
      <main className="w-full px-6">
        {/* Filter Tags */}
        <div className="flex gap-3 py-4 overflow-x-auto">
          {id && (
            <div>
              <button
                onClick={() => router.back()}
                className="md:px-4 flex items-center gap-1 px-2 md:py-2 py-0 rounded-full bg-gray-900 text-white text-sm"
              >
                <span>
                  <ChevronLeft size={16} />
                </span>
                Back
              </button>
            </div>
          )}

          <button className="md:px-4 px-2 md:py-2 py-0 rounded-full bg-gray-900 text-white text-sm">
            All
          </button>
          <button className="md:px-4 px-2 md:py-2 py-0 rounded-full bg-gray-100 text-sm">
            Natural
          </button>
          <button className="md:px-4 px-2 md:py-2 py-0 rounded-full bg-gray-100 text-sm">
            Demonstration
          </button>
          <button className="md:px-4 px-2 md:py-2 py-0 rounded-full bg-gray-100 text-sm">
            Drought
          </button>
          <button className="md:px-4 px-2 md:py-2 py-0 rounded-full bg-gray-100 text-sm">
            Earthquake
          </button>
          <button className="md:px-4 px-2 md:py-2 py-0 rounded-full bg-gray-100 text-sm">
            Flood
          </button>
          <button className="md:px-4 px-2 md:py-2 py-0 rounded-full bg-gray-100 text-sm">
            Political violence
          </button>
        </div>

        <VideoContainer />
      </main>
      {isModalOpen && (
        <CreateVideoModal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

const fileTypes = [
  "webm",
  "mkv",
  "flv",
  "vob",
  "ogv",
  "ogg",
  "rrc",
  "gifv",
  "mng",
  "mov",
  "avi",
  "qt",
  "wmv",
  "yuv",
  "rm",
  "asf",
  "amv",
  "mp4",
  "m4p",
  "m4v",
  "mpg",
  "mp2",
  "mpeg",
  "mpe",
  "mpv",
  "m4v",
  "svi",
  "3gp",
  "3g2",
  "mxf",
  "roq",
  "nsv",
  "flv",
  "f4v",
  "f4p",
  "f4a",
  "f4b",
  "mod",
];

const imageTypes = ["JPG", "PNG", "GIF"];

const CreateVideoModal = ({ onClose }: CreateVideoModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<VideoData>({
    videoTitle: "",
    videoUrl: {},
    videoDescription: "",
    views: 0,
    tags: [],
    videoCategory: "",
    videoDuration: 0,
    videoRelease: new Date(),
    videoGenre: "",
    thumbnail: {},
    userId: "",
  });
  const [imageFile, setImageFile] = useState<File | string | null>(null);
  const [localImageUrl, setLocalImageUrl] = useState<string>("");
  const [videoLocalUrl, setVideoLocalUrl] = useState<string>("");
  const [tagInput, setTagInput] = useState<string>("");
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [submiting, setSubmiting] = useState<boolean>(false);

  const { data: videoCategories } = useQuery<VideoCategory[]>({
    queryKey: ["videos"],
    queryFn: () => getCategories(),
  });

  const { data: videoGenres } = useQuery<VideoGenre[]>({
    queryKey: ["vides"],
    queryFn: () => getGenres(),
  });

  console.log(videoGenres);
  console.log(videoCategories);

  const extractFrame = (videoUrl: string, time: number) => {
    const video = document.createElement("video");
    video.src = videoUrl;
    video.crossOrigin = "anonymous"; // To handle cross-origin issues

    video.onloadedmetadata = () => {
      video.currentTime = time;
    };

    video.onseeked = async () => {
      try {
        const bitmap = await createImageBitmap(video);
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const context = canvas.getContext("2d");
        if (context) {
          context.drawImage(bitmap, 0, 0);
          const image = canvas.toDataURL("image/png");
          setLocalImageUrl(image);
          setImageFile(image);
        }
      } catch (error) {
        console.error("Error extracting frame:", error);
        toast.error("Thumbnail, Error extracting the thumbnail from the video");
      }
    };
  };

  function handleFileChange(file: File[]): void {
    try {
      console.log(file); // Check if the file is correctly captured
      setFile(file[0]);

      if (file[0] && file[0].type.startsWith("video/")) {
        const url = URL.createObjectURL(file[0]);
        setVideoLocalUrl(url);
        extractFrame(url, 0);
        getVideoDuration(url);
      } else {
        toast.error("Invalid file type. Please upload a video file.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error creating object URL");
    }
  }

  const getVideoDuration = (videoUrl: string) => {
    const video = document.createElement("video");
    video.src = videoUrl;
    video.onloadedmetadata = () => {
      handleChange("videoDuration", video.duration);
    };
  };

  function removeTag(currentTag: string) {
    setData({
      ...data,
      tags: data.tags.filter((el) => el !== currentTag),
    });
  }

  function handleImageChange(file: File[]): void {
    setImageFile(file[0]);
    const url = URL.createObjectURL(file[0]);
    setLocalImageUrl(url);
  }

  function handleChange(key: keyof VideoData, value: any): void {
    setData({ ...data, [key]: value });
  }

  // Function to upload an image to cloudinary
  const uploadImage = async (image_file: File | string): Promise<any> => {
    const data = new FormData();
    data.append("file", image_file);
    data.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_UPLOAD_PRESET_THUMBNAIL || "",
    );
    data.append("cloud_name", process.env.NEXT_PUBLIC_CLOUD_NAME || "");
    data.append("folder", "thumbnail");
    // console.log(image_file);
    try {
      const resp = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
        data,
      );
      if (resp) {
        handleChange("thumbnail", {
          URL: resp.data.url,
          publicID: resp.data.public_id,
        });
        // console.log("thumbnail", {url: resp.data.url, public_id: resp.data.public_id});
        return { URL: resp.data.url, publicID: resp.data.public_id };
      } else {
        return null;
      }
    } catch (err) {
      console.log("errr : ", err);
      toast.error("Error! while uploading the thumbnail of the video");
      setLoading(false);
    }
  };

  // Function to upload an image to cloudinary
  const uploadVideo = async (video_file: File): Promise<any> => {
    const data = new FormData();
    data.append("file", video_file);
    data.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_UPLOAD_PRESET_VIDEO || "",
    );
    data.append("cloud_name", process.env.NEXT_PUBLIC_CLOUD_NAME || "");
    data.append("folder", "videos");
    // console.log(image_file);
    try {
      const resp = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/video/upload`,
        data,
      );
      if (resp?.data) {
        handleChange("videoUrl", {
          URL: resp.data.url,
          publicID: resp.data.public_id,
        });
        // console.log("videoUrl", {url: resp.data.url, public_id: resp.data.public_id});
        return { URL: resp.data.url, publicID: resp.data.public_id };
      } else {
        return null;
      }
    } catch (err) {
      console.log("errr : ", err);
      toast.error("Error! while uploading the video");
      setLoading(false);
    }
  };

  const handleKeyDown = (e: any): void => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!data.tags.includes(tagInput.trim())) {
        handleChange("tags", [...data.tags, tagInput.trim()]);
        setTagInput("");
      }
    }
  };
  async function handleSubmit(event: any): Promise<any> {
    event.preventDefault();

    if (!data.videoTitle || !data.videoDescription) {
      return toast.warning(
        "The title and the description of the video are required !",
      );
    } else if (!videoLocalUrl) {
      return toast.warning("You must upload a video first!");
    } else if (!localImageUrl) {
      return toast.warning("upload the thumbnail of your video!");
    } else if (data?.videoDescription?.length < 20) {
      return toast.warning(
        "video description length must be at least 20 characters long",
      );
    }
    window.scrollTo(0, 0);
    setLoading(true);
    const myImage = await uploadImage(imageFile as File);
    const myVideo = await uploadVideo(file as File);

    if (myImage && myVideo) {
      toast.success("Thumbnail and video uploaded");

      setLoading(false);
      setSubmiting(true);

    } else {
      toast.warn("Error while uploading the video and the thumbnail");
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[9990] bg-black bg-opacity-50 backdrop-blur-sm  transition-opacity duration-300"
        onClick={onClose}
      />
      <form
        onSubmit={handleSubmit}
        className="fixed z-[99999] top-1/2 left-1/2 transform max-h-[80vh] -translate-x-1/2 -translate-y-1/2 w-[600px] backdrop-blur-sm max-w-[95vw] overflow-y-scroll bg-white text-black p-8 rounded-lg shadow-xl transition-all duration-300 ease-in-out"
      >
        <div className="flex items-center mb-6 justify-between">
          <div className="flex-1 pl-3">
            <h2 className="font-semibold text-center">PUBLISH A VIDEO</h2>
          </div>
          <div className="cursor-pointer " onClick={onClose}>
            <CgClose size={24} />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="mb-2">Drag & Drop Video</p>
            <FileUploader
              multiple={true}
              handleChange={handleFileChange}
              name="file"
              types={fileTypes}
            />
          </div>
          <div className="space-y-2">
            <p className=" text-gray-600 text-xs">
              {file ? `File name: ${file?.name}` : "no file uploaded yet"}
            </p>
            {file && (
              <ReactPlayer
                width={400}
                height={200}
                controls
                url={videoLocalUrl}
              />
            )}
            {error && <p>Error uploading file: {error.message}</p>}
          </div>

          <div>
            <p className="mb-2">Drag & Drop Image (thumbnail)</p>
            <FileUploader
              multiple={true}
              handleChange={handleImageChange}
              name="file"
              types={imageTypes}
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs text-gray-600">
              {imageFile ? "" : "no image uploaded yet"}
            </p>
            {localImageUrl && (
              <Image
                className=" max-w-[300px]"
                src={localImageUrl}
                alt="thumbnail"
              />
            )}
            {error && <p>Error uploading file: {error.message}</p>}
          </div>

          <div>
            <p className="mb-2">Title</p>
            <Input
              type="text"
              placeholder="Enter the title of your post"
              defaultValue={data?.videoTitle}
              onChange={(e) => handleChange("videoTitle", e.target.value)}
            />
          </div>

          <div>
            <p className="mb-2">Description</p>
            <textarea
              placeholder="Enter the description of your post"
              className="w-full outline-none p-3 rounded bg-transparent border border-gray-600 min-h-[100px]"
              onChange={(e) => handleChange("videoDescription", e.target.value)}
              defaultValue={data?.videoDescription}
            />
          </div>

          <div>
            <p className="mb-2">Category</p>
            {/* <select
              onChange={(e) => handleChange("videoCategory", e.target.value)}
              className="w-full outline-none p-3 rounded bg-transparent border border-gray-600"
            >
              {videoCategories &&
                videoCategories?.map((single_vid) => (
                  <option key={single_vid?._id} value={single_vid?._id}>
                    {single_vid?.name}
                  </option>
                ))}
            </select> */}
          </div>

          <div className="mb-6">
            <label
              htmlFor="beautiful-select"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Video Type
            </label>
            <select
              id="beautiful-select"
              value={data?.videoGenre}
              onChange={(e) => handleChange("videoGenre", e.target.value)}
              className="w-full outline-none p-3 rounded bg-transparent border border-gray-600"
            >
              <option value="" disabled>
                Select a video type
              </option>
              {videoGenres &&
                videoGenres?.map((single_vid) => (
                  <option key={single_vid?._id} value={single_vid?._id}>
                    {single_vid?.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="mx-auto w-full">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Add Hashtags
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-3 outline-none rounded bg-transparent border border-gray-600"
              placeholder="Enter a hashtag and press Enter"
            />
            <div className="mt-4">
              {data.tags.map((hashtag, index) => (
                <span
                  key={index}
                  className="inline-block cursor-pointer bg-blue-500 text-white text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full"
                  onClick={() => removeTag(hashtag)}
                >
                  #{hashtag}
                </span>
              ))}
            </div>
          </div>
          <button className="w-full py-3 text-white rounded-md bg-michael_red_100 text-sm font-bold">
            SUBMIT
          </button>
        </div>
      </form>
    </>
  );
};

export default Videos;
