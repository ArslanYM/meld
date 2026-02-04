"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { ModeToggle } from "./ToggleTheme";
import { Button } from "@/components/ui/button";
import { SignIn, SignInButton, UserProfile, useUser } from "@clerk/nextjs";
import { User2, UserIcon, Zap } from "lucide-react";
import UsageCreditProgress from "./UsageCreditProgress";
import { collection, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../config/FirebaseConfig";
import moment from "moment/moment";
import { where } from "firebase/firestore";
import { getDocs } from "firebase/firestore";
import Link from "next/link";
import axios from "axios";
import { AiSelectedModelContext } from "@/context/AiSelectedModelContext";
import { useContext } from "react";
import { UserButton } from "@clerk/nextjs";
export function AppSidebar() {
  const { user } = useUser();
  const [chatHistory, setChatHistory] = useState([]);
  const [freeMsgCount, setFreeMsgCount] = useState(0);
  const { aiSelectedModels, setAiSelectedModels, messages, setMessages } =
    useContext(AiSelectedModelContext);
  useEffect(() => {
    user && GetChatHistory();
  }, [user]);

  useEffect(() => {
    user && GetRemainingTokenMessages();
  }, [messages]);

  const GetChatHistory = async () => {
    const q = query(
      collection(db, "chatHistory"),
      where("userEmail", "==", user?.primaryEmailAddress?.emailAddress),
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setChatHistory((prev) => [...prev, doc.data()]);
    });
  };

  const GetUserLastMessage = (chat) => {
    const allMessages = Object.values(chat?.messages).flat();
    const userMessages = allMessages.filter((msg) => msg.role === "user");
    const lastUserMsg =
      userMessages.length > 0
        ? userMessages[userMessages.length - 1].content
        : null;
    const lastUpdated = chat?.lastUpdated || null;
    const formattedDate = moment(lastUpdated).fromNow();
    return {
      chatId: chat.chatId,
      message: lastUserMsg,
      lastUpdated: formattedDate,
    };
  };

  const GetRemainingTokenMessages = async () => {
    try {
      const response = await axios.post("/api/user-remaining-msg", {});
      setFreeMsgCount(response?.data?.remainingToken || 0);
    } catch (error) {
      console.error("Error fetching remaining messages:", error);
      setFreeMsgCount(0);
    }
  };
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-3">
          <div className=" flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Image
                src={"/logo.svg"}
                alt="logo"
                width={60}
                height={60}
                ht={60}
                className="w-[40px] h-[40px]"
              />
              <h2 className="font-black text-xl">Meld</h2>
            </div>
            <div>
              <ModeToggle />
            </div>
          </div>
          {user ? (
            <Link href={"/"}>
              <Button variant="outline" className="mt-7 w-full" size="lg">
                + New Chat
              </Button>
            </Link>
          ) : (
            <SignInButton>
              <Button variant="outline" className="mt-7 w-full" size="lg">
                + New Chat
              </Button>
            </SignInButton>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className={"p-3"}>
            <h2 className="font-bold text-lg">Chat</h2>
            {!user && (
              <p className="text-sm ">
                Sign in to start chating with multiple AI models.
              </p>
            )}
            {chatHistory.map((chat, index) => (
              <Link key={index} className="" href={"?chatId=" + chat.chatId}>
                <div className="p-3  cursor-pointer hover:bg-primary/5 ">
                  {" "}
                  <h2
                    className=" text-sm text-primary/20
                  "
                  >
                    {GetUserLastMessage(chat).lastUpdated}
                  </h2>
                  <h2 className=" text-lg text-primary line-clamp-1">
                    {GetUserLastMessage(chat).message}
                  </h2>
                </div>
                <hr className="my-1 " />
              </Link>
            ))}
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-3 mb-10">
          {user ? (
            <>
              <UsageCreditProgress remainingToken={freeMsgCount} />
              <Button className={"w-full mb-3"} variant="outline">
                <Zap />
                Upgrade Plan
              </Button>

              <Button className="flex w-full" variant="ghost">
                <UserButton /> Profile
              </Button>
            </>
          ) : (
            <div>
              <SignInButton mode="modal">
                <Button variant="outline" className={" w-full"}>
                  SignIn/SignUp
                </Button>
              </SignInButton>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
