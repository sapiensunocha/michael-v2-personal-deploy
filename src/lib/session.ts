"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createSession(token: string) {
  const cookieStore = await cookies();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  try {
    cookieStore.set("token", token, {
      expires: expiresAt,
      httpOnly: process.env.NODE_ENV === "production" ? true : false,
      secure: process.env.NODE_ENV === "production" ? true : false,
      path: "/",
      sameSite: "lax",
      domain: process.env.DOMAIN_NAME,
    });
  } catch (error: any) {
    console.log("Error creating session", error);
  }
}

export async function updateSession(token: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    expires: expiresAt,
    httpOnly: process.env.NODE_ENV === "production" ? true : false,
    secure: process.env.NODE_ENV === "production" ? true : false,
    path: "/",
    sameSite: "lax",
    domain: process.env.DOMAIN_NAME,
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}

export async function logout(prevState: any) {
  await deleteSession();
  redirect("/logout");
}
