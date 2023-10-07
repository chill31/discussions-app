import { PrismaClient, Discussion } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const {userId}: {userId: string} = await req.json();
  try {

    const discussions: Discussion[] = await prisma.discussion.findMany({
      where: {
        authorId: userId as string
      }
    });

    return new Response(JSON.stringify({msg: 'found discussions [200]', discussions}), {status: 200});

  } catch(e) {
    console.log(e);
    return new Response(JSON.stringify({error: "Something went wrong [500]"}), {status: 500});
  } finally {
    prisma.$disconnect();
  }
}