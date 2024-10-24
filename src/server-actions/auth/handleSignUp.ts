"use server";

import * as z from "zod";

import createUser from "@/database/queries/users/createUser";

import { SignUpSchema } from "@/zod/schemas/SignUpSchema";
import getSessionUser from "@/database/queries/users/getSessionUser";

export default async function handleSignUp(
  data: z.infer<typeof SignUpSchema>,
): Promise<{ success?: string; error?: string }> {
  try {
    const { role: userRole } = await getSessionUser();
    if (userRole !== "admin") {
      return { error: "You do not have permission to perform this action" };
    }

    const validatedData = SignUpSchema.safeParse(data);

    if (!validatedData.success) {
      return { error: "Invalid information" };
    }

    const { role, email, parentUsername, fullName, username, password } =
      validatedData.data;

    const user = await createUser({
      role,
      email: role === "parent" ? (email ?? null) : null,
      parentUsername: role === "child" ? (parentUsername ?? null) : null,
      fullName,
      username,
      password,
    });
    if (!user) {
      throw new Error("An error occurred");
    }

    return { success: "Sign up success" };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "An error occurred" };
    }
  }
}
