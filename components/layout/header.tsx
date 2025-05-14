"use client";

import { ThemeToggle } from "../theme-toggle";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export const Header = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="fixed flex justify-between w-full left-0 top-0 items-center p-6">
      <h1 className="font-semibold text-xl uppercase">
        Todo<span className="text-green-400">APP</span>
      </h1>
      <div className="flex gap-x-2 items-center">
        <ThemeToggle />
        {session &&
          location.pathname !== "/" && ( //TODO: Fix this
            <Button
              onClick={handleSignOut}
              className="rounded-full"
              size="icon"
            >
              <LogOut />
            </Button>
          )}
      </div>
    </header>
  );
};
