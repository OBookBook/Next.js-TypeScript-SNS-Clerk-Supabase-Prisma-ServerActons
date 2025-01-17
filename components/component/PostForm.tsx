"use client";

import SubmitButton from "./SubmitButton";
import { addPostAction } from "@/lib/action";
import { Input } from "@/components/ui/input";
import { useActionState, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function PostForm() {
  const initialState = {
    error: undefined,
    success: false,
  };
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(addPostAction, initialState);

  return (
    <div>
      <div className="flex items-center gap-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src="/placeholder-user.jpg" />
          <AvatarFallback>AC</AvatarFallback>
        </Avatar>
        <form
          action={formAction}
          className="flex items-center flex-1"
          ref={formRef}
        >
          <Input
            type="text"
            placeholder="What's on your mind?"
            className="flex-1 rounded-full bg-muted px-4 py-2"
            name="post"
          />
          <SubmitButton />
        </form>
      </div>
      {state.error && <p className="text-destructive mt-1">{state.error}</p>}
    </div>
  );
}
