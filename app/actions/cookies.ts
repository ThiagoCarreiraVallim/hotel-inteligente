"use server";

import { cookies } from "next/headers";

export async function setSessionId(sessionId: string) {
  const cookieStore = await cookies();
  cookieStore.set("session_id", sessionId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 45, // 45 dias
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

export async function getSessionId() {
  const cookieStore = await cookies();
  return cookieStore.get("session_id")?.value;
}

export async function removeSessionId() {
  const cookieStore = await cookies();
  cookieStore.delete("session_id");
}
