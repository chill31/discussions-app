import { currentUser } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const {discussionId, content} = await req.json();
  const user = await currentUser();
  try {

    const comment = await prisma.comment.create({
      data: {
        content,
        discussionId: discussionId,
        authorId: user?.id as string,
      }
    });

    const userData: {name: string; avatarURL: string; commentId: string} = {
      name: user?.firstName ?? "" + user?.lastName ?? "",
      avatarURL: user?.imageUrl ?? "",
      commentId: comment.id
    };
     

    return new Response(JSON.stringify({ msg: 'success [200]', comment, userData }), {status: 200})

  } catch(e) {
    console.log(e);
    return new Response(JSON.stringify({ msg: 'failed operation [500]' }), {status: 500})
  } finally {
    prisma.$disconnect();
  }
}