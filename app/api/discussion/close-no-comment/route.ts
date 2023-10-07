import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { id } = await req.json();
  try {
    const discussion = await prisma.discussion.update({
      where: { id: id },
      data: { closed: true },
    });
    return new Response(JSON.stringify({ msg: "closed discussion [200]" }), {
      status: 200,
    });
  } catch (e) {
    console.log(e);
    return new Response(
      JSON.stringify({ msg: "could not close [500]", error: e }),
      { status: 500 }
    );
  } finally {
    prisma.$disconnect();
  }
}
