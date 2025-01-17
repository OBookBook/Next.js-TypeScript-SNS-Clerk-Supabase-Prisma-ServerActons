import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon } from "./Icons";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

export default async function PostForm() {
  async function addPostAction(formData: FormData) {
    "use server";

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

      console.log(error);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar className="w-10 h-10">
        <AvatarImage src="/placeholder-user.jpg" />
        <AvatarFallback>AC</AvatarFallback>
      </Avatar>
      <form action={addPostAction} className="flex items-center flex-1">
        <Input
          type="text"
          placeholder="What's on your mind?"
          className="flex-1 rounded-full bg-muted px-4 py-2"
          name="post"
        />
        <Button variant="ghost" size="icon">
          <SendIcon className="h-5 w-5 text-muted-foreground" />
          <span className="sr-only">Tweet</span>
        </Button>
      </form>
    </div>
  );
}
