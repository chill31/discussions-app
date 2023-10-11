import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { commentId, content } = await req.json();

  try {
    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        content,
      },
      select: {
        content: true
      }
    });

    return new Response(JSON.stringify({ msg: "edited [200]", comment }), {
      status: 200,
    });
  } catch (e) {
    console.log(e);
    return new Response(JSON.stringify({ msg: "error [500]", error: e }), {
      status: 500,
    });
  }
}
