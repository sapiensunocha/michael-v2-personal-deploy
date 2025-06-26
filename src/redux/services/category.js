import client from "./client";

const suffix = "/api/v1/video/category";

// POST -> Create category
export const CreateCategory = async (body) => {
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

// Get -> GET categories
export const getCategories = async (body) => {
  try {
    const { data } = await client.get(`${suffix}/all`, body);
    // console.log(data);
    return data.data;
  } catch (error) {
    // TODO: Remove console.log in production - todo later
    console.log(error);
    const { response } = error;
    if (response?.data) return response.data;

    return { error: error.message || error };
  }
};
