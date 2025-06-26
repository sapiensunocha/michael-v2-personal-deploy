import client from "./client";

const suffix = "/api/v1/video/genre";

// POST -> Create genre
export const createGenre = async (body) => {
  try {
    const { data } = await client.post(`${suffix}/`, body);
    return data;
  } catch (error) {
    // TODO: Remove console.log in production - todo later
    console.log(error);
    const { response } = error;
    if (response?.data) return response.data;

    return { error: error.message || error };
  }
};

// Get -> GET video Genres
export const getGenres = async (body) => {
  try {
    const { data } = await client.get(`${suffix}/all`, body);
    return data.data;
  } catch (error) {
    // TODO: Remove console.log in production - todo later
    console.log(error);
    const { response } = error;
    if (response?.data) return response.data;

    return { error: error.message || error };
  }
};
