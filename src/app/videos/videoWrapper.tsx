import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BiLoader } from "react-icons/bi";
import { getVideos } from "../../redux/services/video";
import CloudinaryVideoPlayer from "./cloudinaryVideoPlayer";
import michaelImage from "../../../public/logowdg12.08.22.png";

const VideoCardSkeleton = () => {
  return (
    <div className="flex flex-wrap pb-32">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="p-2 md:w-72 mb-2">
          <div className="aspect-video bg-gray-200 animate-pulse rounded-lg mb-4" />
          <ul>
            <li className="h-5 bg-gray-200 animate-pulse rounded mb-2 w-3/4" />
            <li className="h-4 bg-gray-200 animate-pulse rounded w-1/4" />
          </ul>
        </div>
      ))}
    </div>
  );
};

const VideoContainer = () => {
  const params = useSearchParams();
  const id = params?.get("id");

  const { data: videos, isFetching } = useQuery({
    queryKey: ["videos"],
    queryFn: getVideos,
  });

  console.log(videos, "videos izi");

  return (
    <div className="flex gap-6">
      {isFetching ? (
        <VideoCardSkeleton />
      ) : (
        videos &&
        videos.length > 0 &&
        (id ? <WatchVideo id={id} /> : <VideoCard videos={videos} />)
      )}
    </div>
  );
};

export default VideoContainer;

const VideoCard = ({ videos }: { videos: any }) => {
  const route = useRouter();
  console.log("route", route);
  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 pb-32">
      {videos?.map((info: any) => (
        <Link key={info?._id} href={`/videos?id=${info?._id}`}>
          <div className="p-2  mb-2">
            <div className="aspect-video bg-gray-200 overflow-hidden rounded-lg mb-2">
              <Image
                className="rounded-xl hover:opacity-60 object-cover bg-bottom h-full w-full transition-opacity duration-300"
                src={info?.thumbnailUrl ? info?.thumbnailUrl : michaelImage}
                width={350}
                height={192}
                alt={info?.fileName}
              />
            </div>
            <ul>
              <li className="font-bold text-gray text-ellipsis overflow-hidden">
                {info?.fileName.length > 50
                  ? info?.fileName
                      .split(" - ")[1]
                      ?.split("")
                      .splice(0, 50)
                      .join("") + "..."
                  : info?.fileName.split(".")[0]}
              </li>
              <li>{info?.category}</li>
            </ul>
          </div>
        </Link>
      ))}
    </div>
  );
};

const WatchVideo = ({ id }: { id: string }) => {
  const { data: videos } = useQuery({
    queryKey: ["video", id],
    queryFn: getVideos,
  });
  const route = useRouter();

  // filter video by id it an array
  const videoData = videos && videos.filter((item: any) => item._id === id)[0];

  console.log("videoData", videoData);

  const width = 1200;
  const height = 600;
  const autoplay = true;

  return (
    <div className="flex gap-6 w-full">
      <div className="flex-1">
        <div className="aspect-video bg-gray-200 overflow-hidden rounded-lg mb-4">
          {videoData?.fileUrl ? (
            <CloudinaryVideoPlayer
              width={width}
              height={height}
              autoplay={autoplay}
              publicID={videoData?.fileUrl}
            />
          ) : (
            <div className="flex justify-center items-center h-full">
              <BiLoader className="text-9xl animate-spin" />
            </div>
          )}
        </div>

        <h1 className="text-xl mb-2">
        {videoData?.fileName.length > 50
                  ? videoData?.fileName
                      .split(" - ")[1]
                      ?.split("")
                      .splice(0, 50)
                      .join("") + "..."
                  : videoData?.fileName.split(".")[0]}
        </h1>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">
            156,987 views • Nov 25, 2022
          </span>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2">
              <span>2.7K</span>
            </button>
            <button className="flex items-center gap-2">
              <span>124</span>
            </button>
            <button className="px-4 py-1 rounded-full bg-gray-100">
              SHARE
            </button>
            <button className="px-4 py-1 rounded-full bg-gray-100">SAVE</button>
          </div>
        </div>

        {/* Channel Info */}
        <div className="flex items-center justify-between py-4 border-t border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            <div>
              <p className="font-medium">User</p>
              <p className="text-sm text-gray-600">1.2K subscribers</p>
            </div>
          </div>
          <button className="px-6 py-2 bg-red-600 text-white rounded">
            SUBSCRIBE
          </button>
        </div>

        {/* Comments Section */}
        <div className="mt-4">
          <h3 className="font-medium mb-4">28 Comments</h3>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
            <input
              type="text"
              placeholder="Add a public comment..."
              className="w-full border-b outline-none pb-2"
            />
          </div>
        </div>
      </div>

      {/* Recommended Videos */}
      <div className="w-[360px] space-y-4">
        {videos?.map((info: any) => (
          <Link key={info?._id} href={`/videos?id=${info?._id}`} prefetch={false}  onClick={(e) => {
            e.preventDefault();
            window.location.href = `/videos?id=${info?._id}`;
          }}>
            <div className="p-2 md:w-64">
              <div className="aspect-video bg-gray-200 overflow-hidden rounded-lg mb-1">
                <Image
                  className="rounded-xl hover:opacity-60 object-cover bg-bottom h-full w-full transition-opacity duration-300"
                  src={info?.thumbnailUrl ? info?.thumbnailUrl : michaelImage}
                  width={350}
                  height={192}
                  alt={info?.fileName}
                />
              </div>
              <ul>
                <li className="text-gray text-ellipsis overflow-hidden">
                {info?.fileName.length > 50
                  ? info?.fileName
                      .split(" - ")[1]
                      ?.split("")
                      .splice(0, 50)
                      .join("") + "..."
                  : info?.fileName.split(".")[0]}
                </li>
              </ul>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
