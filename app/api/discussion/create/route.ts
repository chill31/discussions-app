import { currentUser } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const user = await currentUser();
  const { title, content, tags } = await req.json();

  try {
    const discussion = await prisma.discussion.create({
      data: {
        authorId: user?.id as string,
        content,
        title,
      },
    });
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({
        msg: "error occured while creating discussion [500]",
        error: error,
      }),
      { status: 500 }
    );
  } finally {
    prisma.$disconnect();
  }
}
