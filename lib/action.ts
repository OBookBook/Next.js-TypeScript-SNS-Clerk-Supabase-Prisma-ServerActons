"use server";

import { z } from "zod";
import { prisma } from "./prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

type State = {
  error?: string | undefined;
  success: boolean;
};

export async function addPostAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  try {
    const { userId } = await auth();
    if (!userId) return { error: "user no exsist", success: false };

    const postText = formData.get("post") as string;
    const postTextSchema = z
      .string()
      .min(1, "ポスト内容を入力してください。")
      .max(140, "140文字以内で入力してください");
    const validatedPostText = postTextSchema.parse(postText);

    // await new Promise((resolve) => setTimeout(resolve, 3000));

    await prisma.post.create({
      data: {
        content: validatedPostText,
        authorId: userId,
      },
    });

    revalidatePath("/"); // キャッシュクリア

    return {
      error: undefined,
      success: true,
    };
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
