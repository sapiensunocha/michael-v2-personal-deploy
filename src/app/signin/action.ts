"use server";

import { createSession, deleteSession, updateSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function login(
  prevState: any,
  payload: { token: string; fallbackUrl?: string },
) {
  await createSession(payload.token);

  redirect(payload.fallbackUrl ?? "/map");
}

export async function sessionUpdate(prevState: any, token: string) {
  await updateSession(token);
}

export async function logout(prevState: any) {
  await deleteSession();
  redirect("/logout");
}
