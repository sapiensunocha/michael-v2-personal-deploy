import { useState } from "react";

interface SendMessageResponse {
  success: boolean;
  message: string;
  sid?: string;
}

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (
    to: string,
    username: string,
    longitude: number,
    latitude: number,
  ): Promise<SendMessageResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, username, longitude, latitude }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      return {
        success: true,
        message: "✅ Message sent successfully!",
        sid: data.sid,
      };
    } catch (error: unknown) {
      let errorMessage = "An unknown error occurred";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      console.error("❌ Error sending message:", errorMessage);
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading, error };
};

export default useSendMessage;
