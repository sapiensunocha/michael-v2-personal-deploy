import axios, { AxiosError } from "axios";

interface ChatMessage {
  id: string;
  message: string;
  timestamp: string;
  success: boolean;
}

interface ErrorResponse {
  error: string;
  message?: string;
  success?: boolean;
}

type FetchAIChatMessagesResponse = ChatMessage[] | ErrorResponse;
type PostMessageResponse = ChatMessage | ErrorResponse;

// GET -> Fetch Messages
export const FetchAIChatMessages =
  async (): Promise<FetchAIChatMessagesResponse> => {
    try {
      // console.log(searchkey);
      const { data } = await axios.get<ChatMessage[]>(
        `${process.env.NEXT_PUBLIC_CHAT_APP_AI_URL}/messages`,
      );
      return data;
    } catch (error) {
      // TODO: Remove console.log in production - todo later
      console.log(error);
      const axiosError = error as AxiosError;
      if (axiosError.response?.data)
        return axiosError.response.data as ErrorResponse;

      return { error: axiosError.message || "Unknown error" };
    }
  };

// POST -> send a Messages and get a response
export const PostMessage = async (
  message: string,
): Promise<PostMessageResponse> => {
  try {
    // console.log(searchkey);
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_CHAT_APP_AI_URL}/message`,
      { message },
    );
    return data;
  } catch (error) {
    // TODO: Remove console.log in production - todo later
    console.log(error);
    const axiosError = error as AxiosError;
    if (axiosError.response?.data)
      return axiosError.response.data as ErrorResponse;

    return { error: axiosError.message || "Unknown error" };
  }
};
