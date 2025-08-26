import "server-only";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";

export const getSessionUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
};

export const handleSignInWithGoogle = async () => {
  const google = await authClient.signIn.social({
    provider: "google",
  });
  return google;
};
