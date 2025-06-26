import React, { useState, useEffect, useRef } from "react";
import { Firestore, collection, addDoc, query, orderBy, getDocs } from "firebase/firestore";

interface ChatMessage {
  id?: string;
  sender: "user" | "ai";
  message: string;
  timestamp: number;
}

interface ChatPanelProps {
  db: Firestore | null;
  userId: string | null; // Pass userId from MapComponent
}

const ChatPanel: React.FC<ChatPanelProps> = ({ db, userId }) => {
  const [inputMessage, setInputMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  const appTextStyle: React.CSSProperties = {
    fontFamily: ""Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif",
    color: "#E0E0E0",
    lineHeight: 1.6,
  };

  const messageBubbleStyle = (sender: "user" | "ai"): React.CSSProperties => ({
    maxWidth: "80%",
    padding: "10px 15px",
    borderRadius: "15px",
    marginBottom: "10px",
    wordWrap: "break-word",
    fontSize: "0.95em",
    ...appTextStyle,
    backgroundColor: sender === "user" ? "#007bff" : "#333",
    alignSelf: sender === "user" ? "flex-end" : "flex-start",
    color: sender === "user" ? "white" : "#E0E0E0",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
  });

  const chatContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    height: "calc(100% - 60px)", // Adjust height for input area
    overflowY: "auto",
    padding: "10px",
    borderBottom: "1px solid #444",
  };

  const inputAreaStyle: React.CSSProperties = {
    display: "flex",
    padding: "10px",
    gap: "10px",
    backgroundColor: "rgba(20, 20, 20, 0.95)",
    borderTop: "1px solid #444",
  };

  const textInputStyle: React.CSSProperties = {
    flexGrow: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #444",
    backgroundColor: "#333",
    color: "#E0E0E0",
    fontSize: "1em",
    outline: "none",
    resize: "none", // Prevent vertical resizing by user
    maxHeight: "100px", // Limit input height
    ...appTextStyle,
  };

  const sendButtonStyle: React.CSSProperties = {
    padding: "10px 15px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "1em",
    transition: "background-color 0.2s ease-in-out",
    ...appTextStyle,
  };

  // Scroll to the latest message
  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Load chat history from Firestore on component mount or user change
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!db || !userId) {
        console.log("Firestore or userId not ready for chat history.");
        return;
      }
      try {
        const chatCollectionRef = collection(db, `/artifacts/${__app_id}/users/${userId}/chatHistory`);
        const q = query(chatCollectionRef, orderBy("timestamp", "asc"));
        const querySnapshot = await getDocs(q);
        const loadedMessages: ChatMessage[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() as Omit<ChatMessage, "id"> // Ensure type safety
        }));
        setChatHistory(loadedMessages);
        console.log(`Loaded ${loadedMessages.length} chat messages for user ${userId}.`);
      } catch (error) {
        console.error("Failed to load chat history:", error);
      }
    };
    loadChatHistory();
  }, [db, userId]);


  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || !db || !userId) return;

    setIsLoading(true);
    const userMessage: ChatMessage = {
      sender: "user",
      message: inputMessage,
      timestamp: Date.now(),
    };

    const newChatHistory = [...chatHistory, userMessage];
    setChatHistory(newChatHistory);
    setInputMessage("");

    // Save user message to Firestore
    try {
      const chatCollectionRef = collection(db, `/artifacts/${__app_id}/users/${userId}/chatHistory`);
      await addDoc(chatCollectionRef, userMessage);
    } catch (firestoreError) {
      console.error("Failed to save user message to Firestore:", firestoreError);
    }

    try {
      // Prepare chat history for LLM API call
      let chatHistoryForApi = newChatHistory.map(msg => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.message }]
      }));

      // Add a system prompt for context and safety
      const systemPrompt = {
        role: "system",
        parts: [{ text: `You are an AI Disaster Assistant from Michael App by the World Disaster Center. Your purpose is to provide helpful, concise, and accurate advice on disaster preparedness, response, and recovery. You can also teach about various disaster types. Keep responses user-friendly and avoid overly technical jargon. If asked for real-time SOS routes or real-time location-based advice, state that you are an AI model and cannot provide real-time assistance or direct emergency services, but can offer general guidance. Do NOT provide medical advice.` }]
      };

      // Construct the payload for the Gemini API
      const payload = {
        contents: [systemPrompt, ...chatHistoryForApi],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 500,
        }
      };

      const apiKey = ""; // Canvas will provide this at runtime
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Gemini API HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      let aiMessageContent = "I"m sorry, I couldn"t generate a response at this time. Please try again.";

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        aiMessageContent = result.candidates[0].content.parts[0].text;
      } else {
        console.warn("Gemini API returned an unexpected structure or no content:", result);
        if (result.error && result.error.message) {
          aiMessageContent = `Error from AI: ${result.error.message}`;
        }
      }

      const aiMessage: ChatMessage = {
        sender: "ai",
        message: aiMessageContent,
        timestamp: Date.now(),
      };
      setChatHistory((prev) => [...prev, aiMessage]);

      // Save AI message to Firestore
      try {
        const chatCollectionRef = collection(db, `/artifacts/${__app_id}/users/${userId}/chatHistory`);
        await addDoc(chatCollectionRef, aiMessage);
      } catch (firestoreError) {
        console.error("Failed to save AI message to Firestore:", firestoreError);
      }

    } catch (apiError: any) {
      console.error("Error calling Gemini API:", apiError);
      const errorMessage: ChatMessage = {
        sender: "ai",
        message: `Oops! I encountered an error: ${apiError.message}. Please try again later.`,
        timestamp: Date.now(),
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", ...appTextStyle }}>
      <div style={chatContainerStyle}>
        {chatHistory.length === 0 ? (
          <p style={{ textAlign: "center", color: "#A0A0A0", marginTop: "20px" }}>
            Welcome! Ask me anything about disaster preparedness, safety, or what to do during an emergency.
          </p>
        ) : (
          chatHistory.map((msg, index) => (
            <div key={msg.id || index} style={messageBubbleStyle(msg.sender)}>
              {msg.message}
            </div>
          ))
        )}
        {isLoading && (
          <div style={{ alignSelf: "flex-start", padding: "10px 15px", borderRadius: "15px", backgroundColor: "#555", color: "#E0E0E0", marginBottom: "10px" }}>
            AI is typing...
          </div>
        )}
        <div ref={chatMessagesEndRef} />
      </div>
      <form onSubmit={sendMessage} style={inputAreaStyle}>
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          style={textInputStyle}
          rows={1}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage(e);
            }
          }}
          aria-label="Chat input"
          disabled={!db || !userId} // Disable if Firebase is not ready
        />
        <button type="submit" style={sendButtonStyle} disabled={isLoading || !db || !userId}>
          Send
        </button>
      </form>
      {!userId && <p style={{ color: "#ffc107", textAlign: "center", padding: "5px", fontSize: "0.8em" }}>Login to save chat history.</p>}
    </div>
  );
};

export default ChatPanel;
