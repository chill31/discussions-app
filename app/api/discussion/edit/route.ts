import { currentUser } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const user = await currentUser();
  const { title, content, tags, unlisted, id} = await req.json();

  try {
    const discussion = await prisma.discussion.update({
      where: {
        id: id
      },
      data: {
        authorId: user?.id as string,
        content,
        title,
        tags,
        unlisted
      },
    });
    return new Response(JSON.stringify({ discussion, msg: 'edited discussion [200]' }), { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response(
      JSON.stringify({
        msg: "error occured while editing discussion [500]",
        error: e,
      }),
      { status: 500 }
    );
  } finally {
    prisma.$disconnect();
  }
}
