import { prisma } from "./prisma";

export async function fethPosts(userId: string) {
  // ServerComponent内で、prismaを呼んだ場合: SSR
  return await prisma.post.findMany({
    where: {
      authorId: {
        in: [userId],
      },
    },
    include: {
      author: true,
      likes: {
        select: {
          userId: true,
        },
      },
      _count: {
        select: {
          replies: true,
        },
      },
    },
    orderBy: {},
  });
}
