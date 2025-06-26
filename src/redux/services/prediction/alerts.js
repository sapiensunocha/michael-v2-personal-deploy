import axios from "axios";

export const sendAlert = async (body) => {
  try {
    const { data } = await axios.post(
      `${process.env.REACT_APP_ALERT_API_KEY}/`,
      body,
    );
    return data;
  } catch (error) {
    console.log(error);
    const { response } = error;
    if (response?.data) return response.data;

    return { error: error.message || error };
  }
};
