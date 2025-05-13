"use client";

import { Github, Loader } from "lucide-react";
import { Button } from "./ui/button";
import { customSignIn } from "@/lib/auth-client";
import { useState } from "react";

export const SignCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await customSignIn();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-2 border items-center p-12">
      <h2 className="font-semibold text-lg uppercase tracking-widest">
        Todo<span className="text-green-400 ml-2">APP</span>
      </h2>
      <Button
        className="flex gap-x-2 font-light"
        variant="signIn"
        onClick={handleSignIn}
        disabled={isLoading}
      >
        {!isLoading ? (
          <Github className="size-5" />
        ) : (
          <Loader className="size-5 animate-spin" />
        )}
        Sign in with Github
      </Button>
    </div>
  );
};
