import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
});

const { signIn, getSession, signOut } = authClient;

const customSignIn = async () => {
  signIn.social({
    provider: "github",
    callbackURL: "/welcome",
  });
};

export { signIn, getSession, signOut, customSignIn };
