import client from "./client";

const suffix = "/file/list?fileType=video";

const getAuthToken = () => {
  return localStorage.getItem("accessToken");
};

export const getVideos = async () => {
  try {
    const token = getAuthToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const { data } = await client.get(suffix, { headers });

    return data?.data || [];
  } catch (error) {
    console.error("Error fetching videos:", error);
    return { error: error.message || error };
  }
};

export const getVideo = async (id) => {
  try {
    const videos = await getVideos();
    return videos.find((video) => video._id === id) || null;
  } catch (error) {
    console.error("Error fetching video:", error);
    return { error: error.message || error };
  }
};

export const createVideo = async (body) => {
  try {
    const token = getAuthToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const { data } = await client.post("/api/v1/file/upload", body, { headers });

    return data;
  } catch (error) {
    console.error("Error creating video:", error);
    return { error: error.message || error };
  }
};
