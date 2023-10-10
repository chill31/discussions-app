import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { notificationId } = await req.json();

  try {
    const notification = await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        read: true
      }
    });

    return new Response(JSON.stringify({ msg: "success [200]", notification }), {
      status: 200,
    });
  } catch (e) {
    console.log(e);
    return new Response(
      JSON.stringify({ msg: "failed to delete [500]", error: e }),
      { status: 500 }
    );
  }
}
