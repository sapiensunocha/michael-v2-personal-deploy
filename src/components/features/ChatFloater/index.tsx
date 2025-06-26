"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { FaPaperPlane, FaSpinner, FaExclamationTriangle, FaMicrophone } from "react-icons/fa";
import { toast } from "react-toastify";
import Image from "next/image";
// import fireFighter from "../../../../assets/icons/fighterFighter.png";
import { Command } from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Trash2, X } from "lucide-react";

// Type definitions for Speech Recognition API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
  readonly length: number
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  readonly length: number
  [index: number]: SpeechRecognitionAlternative
  isFinal: boolean
}

interface SpeechRecognitionAlternative {
  readonly transcript: string
  readonly confidence: number
}

interface SpeechRecognitionError extends Event {
  readonly error: string
  readonly message: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: (event: SpeechRecognitionEvent) => void
  onerror: (event: SpeechRecognitionError) => void
  onend: () => void
  start(): void
  stop(): void
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

// Using environment variable for API URL
const DISASTER_API_URL =
  process.env.NEXT_PUBLIC_DISASTER_API_URL || "https://michael-1044744936985.us-central1.run.app/chat";

interface ChatResponse {
  analysis: string
  sources: {
    title: string
    url: string
  }[]
  safety_notice: string
}

function ChatAIFloater({ chatOpen }: { chatOpen: boolean }) {
  const [chatMessages, setChatMessages] = useState<
    {
      sender: string
      text?: string
      analysis?: string
      safety_notice?: string
      sources?: { title: string; url: string }[]
    }[]
  >([
    {
      sender: "ai",
      text: "Hello, I'm Michael. I'll assist you on all disaster-related matters.",
    },
    { sender: "ai", text: "How can I help you? 😊" },
  ]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const scrollChat = useRef<HTMLDivElement>(null);
  const outSideClick = useRef<HTMLDivElement>(null);
  const [focusCheck, setFocusCheck] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (outSideClick.current && !outSideClick.current.contains(event.target as Node)) setFocusCheck(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive or when showing confirmation
  useEffect(() => {
    if (scrollChat.current) {
      scrollChat.current.scrollTop = scrollChat.current.scrollHeight;
    }
  }, [chatMessages, showClearConfirmation]);

  // Initialize speech recognition
  useEffect(() => {
    // Check if the browser supports SpeechRecognition
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      console.log("Speech recognition not supported in this browser");
      return;
    }

    recognitionRef.current = new SpeechRecognitionAPI();

    if (recognitionRef.current) {
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setMessage((prevMessage) => prevMessage + transcript);
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionError) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Toggle speech recognition
  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition is not supported in your browser");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Speech recognition error:", error);
        toast.error("Could not start speech recognition. Please try again.");
      }
    }
  };

  const formatMarkdown = (markdown: string): string => {
    let formatted = markdown.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    formatted = formatted.replace(/✅ (.*?)(?=\n|$)/g, "• $1");
    formatted = formatted.replace(/🚫 (.*?)(?=\n|$)/g, "× $1");
    formatted = formatted.replace(/\\\\n/g, "\n");
    return formatted;
  };

  const handleChatSubmit = async (
    event?: React.MouseEvent<HTMLButtonElement> | null,
    messagekey = "",
    notify = false,
  ) => {
    if (event) event.preventDefault();

    let userMessage = message;
    if (messagekey !== "") userMessage = messagekey;

    if (!userMessage.trim()) return;

    try {
      setLoading(true);

      setChatMessages((prevMessages) => [...prevMessages, { sender: "user", text: userMessage }]);

      const response = await fetch(DISASTER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data: ChatResponse = await response.json();

      const formattedAnalysis = formatMarkdown(data.analysis);

      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "ai",
          analysis: formattedAnalysis,
          safety_notice: data.safety_notice,
          sources: data.sources,
        },
      ]);

      if (notify) toast(data.analysis, { position: "top-right", theme: "dark" });

      setMessage("");
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : "Network error. Please try again."}`);
      console.error("Chat API error:", error);
    } finally {
      setLoading(false);
    }
  };

  function HandleKeyPress(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleChatSubmit();
    }
  }

  const clearChat = () => {
    setChatMessages([
      {
        sender: "ai",
        text: "Hello, I'm Michael. I'll assist you on all disaster-related matters.",
      },
      { sender: "ai", text: "How can I help you? 😊" },
    ]);
    setShowClearConfirmation(false);
  };

  if (!chatOpen) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-4 md:w-[400px] max-w-[95vw] z-50">
      <Card
        ref={outSideClick}
        className="bg-[#ffff]/30 backdrop-blur-md shadow-lg border border-white/40 h-[30rem] flex flex-col"
      >
        <CardHeader className="p-3 pb-0 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8 bg-[#424242]">
                {/* <Image src={fireFighter || "/placeholder.svg"} width={32} height={32} alt="Michael" /> */}
                <Image src= "/assets/icons/michaelicon.png" width={32} height={32} alt="Michael" />

              </Avatar>
              <div>
                <h3 className="text-sm font-medium">Michael</h3>
                <p className="text-xs text-muted-foreground">Disaster Response Assistant</p>
              </div>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setShowClearConfirmation(true)}
                  >
                    <Trash2 size={16} className="text-gray-500 hover:text-red-500 transition-colors" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear chat</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>

        <CardContent className="p-3 flex-1 overflow-hidden">
          <ScrollArea ref={scrollChat} className="h-full pr-4" type="always">
            <div className="flex flex-col space-y-4 pb-4">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === "ai" ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`
                      flex flex-col space-y-1 
                      ${msg.sender === "user" ? "items-end" : "items-start"}
                      ${msg.sender === "user" ? "max-w-[80%]" : "max-w-[90%]"}
                    `}
                  >
                    <div
                      className={`
                        px-4 py-2 rounded-2xl break-words overflow-hidden
                        ${
                          msg.sender === "user"
                            ? "bg-[#424242] text-white rounded-tr-none"
                            : "bg-white text-black rounded-tl-none"
                        }
                      `}
                    >
                      {msg.text && <p className="text-sm whitespace-pre-line">{msg.text}</p>}

                      {msg.analysis && (
                        <div className="analysis-section">
                          <p
                            className="text-sm whitespace-pre-line font-medium"
                            dangerouslySetInnerHTML={{ __html: msg.analysis }}
                          />
                        </div>
                      )}
                    </div>

                    {msg.safety_notice && (
                      <div className="w-full mt-1 p-2 bg-yellow-50 border-l-4 border-yellow-500 rounded text-left">
                        <div className="flex items-start">
                          <FaExclamationTriangle className="text-yellow-500 mt-1 mr-2 flex-shrink-0" />
                          <p className="text-xs text-gray-700 break-words">{msg.safety_notice}</p>
                        </div>
                      </div>
                    )}

                    {msg.sources && msg.sources.length > 0 && (
                      <div className="w-full mt-1 text-xs border-t border-gray-200 pt-2 text-left">
                        <p className="font-semibold text-gray-600">Sources:</p>
                        <ul className="mt-1 space-y-1">
                          {msg.sources.map((source, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="mr-1 text-gray-400 mt-1 flex-shrink-0">•</span>
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline break-words overflow-hidden"
                              >
                                {source.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-center items-center py-2">
                  <div className="flex items-center space-x-1">
                    <div
                      className="h-2 w-2 rounded-full bg-gray-500 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 rounded-full bg-gray-500 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 rounded-full bg-gray-500 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Clear chat confirmation at the bottom of messages */}
              {showClearConfirmation && (
                <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md border border-gray-200 mx-auto w-full mt-2">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">Clear conversation</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setShowClearConfirmation(false)}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    This will delete all messages in this conversation. This action cannot be undone.
                  </p>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => setShowClearConfirmation(false)}
                    >
                      Cancel
                    </Button>
                    <Button variant="destructive" size="sm" className="h-8 text-xs" onClick={clearChat}>
                      Clear
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="p-3 pt-0 flex-shrink-0">
          <Command className="rounded-lg border shadow-md w-full">
            <div className="flex items-center p-1">
              <Textarea
              placeholder="Ask Michael about disaster..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onFocus={() => setFocusCheck(true)}
                onBlur={() => setFocusCheck(false)}
                onKeyDown={HandleKeyPress}
                className={`min-h-10 h-10 resize-none border-0 p-2 text-sm focus-visible:ring-0 ${focusCheck ? "bg-gray-50" : "bg-transparent"}`}
              />

              <div className="flex items-center gap-1 px-1">
                <Button
                  onClick={toggleListening}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  title={isListening ? "Stop listening" : "Start voice input"}
                  type="button"
                >
                  <FaMicrophone
                    className={`${isListening ? "text-red-500 animate-pulse" : "text-gray-500"}`}
                    size={16}
                  />
                </Button>

                <Button
                  onClick={(event) => handleChatSubmit(event)}
                  disabled={loading || message.trim() === ""}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  type="button"
                >
                  {!loading ? (
                    <FaPaperPlane className={message.trim() !== "" ? "text-black" : "text-gray-300"} size={16} />
                  ) : (
                    <FaSpinner className="animate-spin" size={16} />
                  )}
                </Button>
              </div>
            </div>
          </Command>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ChatAIFloater;

