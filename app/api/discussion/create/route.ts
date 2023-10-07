import { currentUser } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";

import { CreateSchema } from "@/helpers/types/createSchema";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const user = await currentUser();
  const { title, content, tags, unlisted }: CreateSchema = await req.json();

  try {
    const discussion = await prisma.discussion.create({
      data: {
        authorId: user?.id as string,
        content,
        title,
        tags,
        unlisted
      },
    });
    return new Response(JSON.stringify({ discussion, msg: 'created discussion [200]' }), { status: 200 });
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
