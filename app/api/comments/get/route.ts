import { clerkClient } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const {id} = await req.json();
  try {
    const comments = await prisma.comment.findMany({
      where: {
        discussionId: id
      }
    });

    const userData: {name: string; avatarURL: string; commentId: string}[] = [];
    await Promise.all(comments.map(async(comment) => {
      const user = await clerkClient.users.getUser(comment.authorId);
      userData.push({
        name: user.firstName + " " + user.lastName,
        avatarURL: user.imageUrl,
        commentId: comment.id
      })
    }));

    return new Response(JSON.stringify({msg: 'found comments [200]', comments, userData}), {status: 200})
  } catch(e) {
    console.log(e);
    return new Response(JSON.stringify({msg: "Something went wrong [500]", error: e}), {status: 500})
  } finally {
    await prisma.$disconnect();
  }
}