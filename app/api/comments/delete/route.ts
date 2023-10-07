import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const {id} = await req.json();
  try {

    const comment = await prisma.comment.delete({
      where: {
        id: id
      }
    });

    return new Response(JSON.stringify({ msg: 'deleted comment [200]' }), {status:200})

  } catch(e) {
    console.log(e);
    return new Response(JSON.stringify({ msg: 'server error [500]', error: e }), {status: 200})
  } finally {
    prisma.$disconnect();
  }
}