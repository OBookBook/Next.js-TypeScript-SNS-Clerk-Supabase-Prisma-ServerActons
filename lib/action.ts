"use server";

import { z } from "zod";
import { prisma } from "./prisma";
import { auth } from "@clerk/nextjs/server";

export async function addPostAction(formData: FormData) {
  try {
    const { userId } = await auth();
    if (!userId) return;

    const postText = formData.get("post") as string;
    const postTextSchema = z
      .string()
      .min(1, "ポスト内容を入力してください。")
      .max(140, "140文字以内で入力してください");
    const validatedPostText = postTextSchema.parse(postText);

    await prisma.post.create({
      data: {
        content: validatedPostText,
        authorId: userId,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error: error.errors.map((e) => e.message).join(", "),
        success: false,
      };
    } else if (error instanceof Error) {
      return {
        error: error.message,
        success: false,
      };
    } else {
      return {
        error: "An unexpected error has occurred.",
        success: false,
      };
    }
  }
}
