import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const {id} = await req.json();
  try {
    const discussion = await prisma.discussion.delete({
      where: {
        id: id,
      },
    });

    return new Response(JSON.stringify({ msg: 'deleted discussion [200]' }), {status:200}) 
  } catch(e) {
    console.log(e);
    return new Response(JSON.stringify({ msg: 'could not delete discussion [500]', error: e }), {status: 500})
  } finally {
    prisma.$disconnect();
  }
}