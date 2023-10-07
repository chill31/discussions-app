import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { id } = await req.json();
  try {

    const discussion = await prisma.discussion.findUnique({
      where: {
        id: id
      }
    });
    
    return new Response(JSON.stringify({ msg: 'found discussion [200]', discussion }), {status: 200});

  } catch(e) {
    console.log(e);
    return new Response(JSON.stringify({ msg: 'failed to get discussion [500]', error: e }), {status: 500})
  } finally {
    prisma.$disconnect();
  }
}