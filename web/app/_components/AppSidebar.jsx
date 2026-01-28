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

export function AppSidebar() {
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
          <Button variant="outline" className="mt-7 w-full" size="lg">
            + New Chat
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className={"p-3"}>
            <h2 className="font-bold text-lg">Chat</h2>
            <p className="text-sm ">
              Sign in to start chating with multiple AI models.
            </p>
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-3 mb-10">
          <Button variant="outline" className={" w-full"}>
            SignIn/SignUp
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
