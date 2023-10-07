import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const {discussionId, authorId} = await req.json();
  try {

    const discussion = await prisma.discussion.findUnique({
      where: {
        id: discussionId,
        authorId: authorId
      },
      select: {
        title: true,
        content: true,
        unlisted: true,
        tags: true
      }
    });

    if(discussion === null) return new Response(JSON.stringify({ isOwner: false }), {status: 401});
    return new Response(JSON.stringify({ msg: 'found discussion', isOwner: true, discussion }), {status: 200})

  } catch(e) {
    console.log(e);
    return new Response(JSON.stringify({ msg: 'failed to fetch ownership [500]', error: e }), {status:500})
  } finally {
    prisma.$disconnect();
  }
}