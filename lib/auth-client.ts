import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
});

const { signIn, useSession, signOut } = authClient;

const customSignIn = () => {
  signIn.social({
    provider: "github",
    callbackURL: "/welcome",
  });
};

export { signIn, useSession, signOut, customSignIn };
