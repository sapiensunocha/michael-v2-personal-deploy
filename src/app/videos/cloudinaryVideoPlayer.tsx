import { useEffect, useRef } from "react";

declare global {
  interface Window {
    cloudinary: any;
  }
}

function CloudinaryVideoPlayer({
  width,
  height,
  autoplay,
  publicID,
}: {
  width: number;
  height: number;
  autoplay: boolean;
  publicID: string;
}) {
  const cloudinaryRef = useRef<any>(null);
  const videoRef = useRef<any>(null);
  // console.log(publicID)

  useEffect(() => {
    const loadCloudinaryScript = async () => {
      // Load CSS
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://cdnjs.cloudflare.com/ajax/libs/cloudinary-video-player/2.1.0/cld-video-player.min.css";
      document.head.appendChild(link);

      // Load JS
      if (!window.cloudinary) {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/cloudinary-video-player/2.1.0/cld-video-player.min.js";
        script.async = true;
        await new Promise<void>((resolve) => {
          script.onload = () => resolve();
          document.body.appendChild(script);
        });
      }
    };

    const initializePlayer = async () => {
      await loadCloudinaryScript();
      if (!cloudinaryRef.current) {
        cloudinaryRef.current = window.cloudinary;
        cloudinaryRef.current.videoPlayer(videoRef.current, {
          cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME,
        });
      }
    };

    initializePlayer();
  }, []);

  return (
    <video
      className="w-full h-full"
      ref={videoRef}
      width={width}
      height={height}
      autoPlay={autoplay}
      controls
      data-cld-public-id={publicID}
    />
  );
}

export default CloudinaryVideoPlayer;
