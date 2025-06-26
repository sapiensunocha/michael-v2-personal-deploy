import axios from "axios";

// GET -> Fetch Messages
export const FetchAIChatMessages = async () => {
  try {
    // console.log(searchkey);
    const { data } = await axios.get(
      `${process.env.REACT_APP_CHAT_APP_AI_URL}/messages`,
    );
    return data;
  } catch (error) {
    // TODO: Remove console.log in production - todo later
    console.log(error);
    const { response } = error;
    if (response?.data) return response.data;

    return { error: error.message || error };
  }
};

// POST -> send a Messages and get a response
export const PostMessage = async (message) => {
  try {
    // console.log(searchkey);
    const { data } = await axios.post(
      `${process.env.REACT_APP_CHAT_APP_AI_URL}/message`,
      { message },
    );
    return data;
  } catch (error) {
    // TODO: Remove console.log in production - todo later
    console.log(error);
    const { response } = error;
    if (response?.data) return response.data;

    return { error: error.message || error };
  }
};
