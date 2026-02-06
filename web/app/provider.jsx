"use client";

import React, { useEffect, useState } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/AppSidebar";
import AppHeader from "./_components/AppHeader";
import { useUser } from "@clerk/nextjs";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { AiSelectedModelContext } from "@/context/AiSelectedModelContext";
import { DefaultModel } from "@/shared/AiModelsShared";
import { UserDetailContext } from "@/context/UserDetailContext";
import { Toaster } from "@/components/ui/sonner";

const Provider = ({ children, ...props }) => {
  const { user } = useUser();
  const [aiSelectedModels, setAiSelectedModels] = useState(DefaultModel);
  const [messages, setMessages] = useState({});
  const [userDetail, setUserDetail] = useState();
  useEffect(() => {
    if (user) {
      CreateNewUser();
    }
  }, [user]);

  useEffect(() => {
    if (aiSelectedModels) {
      updateAiSelectionPref();
    }
  }, [aiSelectedModels]);

  const updateAiSelectionPref = async () => {
    if (user) {
      const docRef = doc(db, "users", user?.primaryEmailAddress.emailAddress);
      await updateDoc(docRef, {
        selectedModelPref: aiSelectedModels,
      });
    }
  };

  const CreateNewUser = async () => {
    console.log("db call");

    const userRef = doc(db, "users", user?.primaryEmailAddress?.emailAddress);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      console.log("user exists already");
      const userInfo = userSnap.data();
      setAiSelectedModels(userInfo.selectedModelPref ?? DefaultModel);
      setUserDetail(userInfo);
      return;
    } else {
      const userData = {
        name: user?.fullName,
        email: user.primaryEmailAddress.emailAddress,
        createdAt: new Date(),
        remainingMsg: 5,
        plan: "Free",
        credits: 1000,
      };
      await setDoc(userRef, userData);
      console.log("created user");
      setUserDetail(userData);
    }
  };
  return (
    <NextThemeProvider
      {...props}
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
        <AiSelectedModelContext.Provider
          value={{
            aiSelectedModels,
            setAiSelectedModels,
            messages,
            setMessages,
          }}
        >
          <SidebarProvider>
            <AppSidebar />
            <div className="w-full">
              {" "}
              <AppHeader />
              {children}
            </div>
          </SidebarProvider>
        </AiSelectedModelContext.Provider>
      </UserDetailContext.Provider>
      <Toaster position="top-center" />
    </NextThemeProvider>
  );
};

export default Provider;
