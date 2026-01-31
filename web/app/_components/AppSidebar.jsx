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
import { SignIn, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { User2, UserIcon, Zap } from "lucide-react";
import UsageCreditProgress from "./UsageCreditProgress";

export function AppSidebar() {
  const { user } = useUser();
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
            <Button variant="outline" className="mt-7 w-full" size="lg">
              + New Chat
            </Button>
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
            {user ? (
              <></>
            ) : (
              <p className="text-sm ">
                Sign in to start chating with multiple AI models.
              </p>
            )}
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-3 mb-10">
          {user ? (
            <>
              <UsageCreditProgress />
              <Button className={"w-full mb-3"} variant="outline">
                <Zap />
                Upgrade Plan
              </Button>
              <Button className="flex w-full" variant="ghost">
                <User2 /> Settings
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
