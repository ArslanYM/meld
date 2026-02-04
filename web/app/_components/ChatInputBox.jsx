"use client";
import { Button } from "@/components/ui/button";
import { Mic, Paperclip, Send } from "lucide-react";
import React, { use, useContext, useEffect, useState, Suspense } from "react";
import AiMultiModel from "./AiMultiModel";
import { AiSelectedModelContext } from "@/context/AiSelectedModelContext";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig.js";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

const ChatInputBoxContent = () => {
  const [userInput, setUserInput] = useState("");
  const { aiSelectedModels, setAiSelectedModels, messages, setMessages } =
    useContext(AiSelectedModelContext);
  const { user } = useUser();
  const [chatId, setChatId] = useState(null);

  const params = useSearchParams();

  useEffect(() => {
    const chatId_ = params.get("chatId");
    if (chatId_) {
      setChatId(chatId_);
      GetMessages(chatId_);
    } else {
      setChatId(uuidv4());
      setMessages([]);
    }
  }, [params]);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    try {
      const response = await axios.post("/api/user-remaining-msg", {
        token: 1,
      });
      const remainingToken = response?.data?.remainingToken;

      if (remainingToken <= 0) {
        toast.error(
          "You have exhausted your free message quota. Please upgrade your plan to continue using the service.",
        );
        return;
      }
    } catch (error) {
      console.error("Error checking remaining messages:", error);
      toast.error("Failed to check message quota. Please try again.");
      return;
    }

    // 1️⃣ Add user message to all enabled models
    setMessages((prev) => {
      const updated = { ...prev };
      Object.keys(aiSelectedModels).forEach((modelKey) => {
        if (aiSelectedModels[modelKey].enable) {
          updated[modelKey] = [
            ...(updated[modelKey] ?? []),
            { role: "user", content: userInput },
          ];
        }
      });

      return updated;
    });

    const currentInput = userInput; // capture before reset
    setUserInput("");

    // 2️⃣ Fetch response from each enabled model
    Object.entries(aiSelectedModels).forEach(
      async ([parentModel, modelInfo]) => {
        if (!modelInfo.modelId || aiSelectedModels[parentModel].enable == false)
          return;

        // Add loading placeholder before API call
        setMessages((prev) => ({
          ...prev,
          [parentModel]: [
            ...(prev[parentModel] ?? []),
            {
              role: "assistant",
              content: "loading...",
              model: parentModel,
              loading: true,
            },
          ],
        }));

        try {
          const result = await axios.post("/api/ai-multimodel", {
            model: modelInfo.modelId,
            msg: [{ role: "user", content: currentInput }],
            parentModel,
          });

          const { aiResponse, model } = result.data;

          // 3️⃣ Add AI response to that model’s messages
          setMessages((prev) => {
            const updated = [...(prev[parentModel] ?? [])];
            const loadingIndex = updated.findIndex((m) => m.loading);

            if (loadingIndex !== -1) {
              updated[loadingIndex] = {
                role: "assistant",
                content: aiResponse,
                model,
                loading: false,
              };
            } else {
              // fallback if no loading msg found
              updated.push({
                role: "assistant",
                content: aiResponse,
                model,
                loading: false,
              });
            }

            return { ...prev, [parentModel]: updated };
          });
        } catch (err) {
          console.error(err);
          setMessages((prev) => ({
            ...prev,
            [parentModel]: [
              ...(prev[parentModel] ?? []),
              { role: "assistant", content: "⚠️ Error fetching response." },
            ],
          }));
        }
      },
    );
  };

  const GetMessages = async (chatId_) => {
    const docRef = doc(db, "chatHistory", chatId_);
    const docSnap = await getDoc(docRef);
    console.log("Document data:", docSnap.data());
    if (docSnap.exists()) {
      setMessages(docSnap.data().messages);
    }
    return;
  };

  useEffect(() => {
    if (messages) {
      SaveMessages();
    }
  }, [messages]);

  const SaveMessages = async () => {
    if (!chatId) return;

    // Check if there are any actual messages before saving
    const hasMessages = Object.values(messages).some(
      (modelMessages) =>
        Array.isArray(modelMessages) && modelMessages.length > 0,
    );

    if (!hasMessages) return;

    const docRef = doc(db, "chatHistory", chatId);
    await setDoc(docRef, {
      messages: messages,
      chatId: chatId,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      lastUpdated: Date.now(),
    });
  };
  return (
    <div className="relative max-h-screen">
      {/* Page Content */}
      <div>
        <AiMultiModel />
      </div>
      {/* Fixed chat input */}
      <div className="fixed bottom-10  flex left-0 w-full justify-center px-4 pb-4">
        <div className="w-full border rounded-xl shadow-md max-w-2xl p-4">
          <input
            value={userInput}
            onChange={(e) => {
              setUserInput(e.target.value);
            }}
            type="text"
            placeholder="Ask me anything"
            className=" w-full border-0 outline-none"
          />
          <div className="flex mt-3 justify-between items-center ">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-5 w-5" />{" "}
            </Button>

            <div className="flex gap-5">
              <Button variant="ghost" size="icon">
                <Mic />
              </Button>
              <Button
                onClick={() => {
                  handleSend();
                }}
                variant="outline"
                size="icon"
              >
                <Send />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatInputBox = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ChatInputBoxContent />
  </Suspense>
);

export default ChatInputBox;
