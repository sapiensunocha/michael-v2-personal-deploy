export async function getFramesFromVideo(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    video.addEventListener("loadeddata", () => {
      try {
        // Set canvas size to match video dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the first frame
        context?.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert to base64
        const base64Frame = canvas
          .toDataURL("image/jpeg")
          .replace("data:image/jpeg;base64,", "");

        resolve([base64Frame]);
      } catch (error) {
        reject(error);
      }
    });

    video.addEventListener("error", (error) => {
      reject(error);
    });

    // Create object URL for the video file
    const videoUrl = URL.createObjectURL(file);
    video.src = videoUrl;
  });
}
