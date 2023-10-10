import { clerkClient } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { forUserId } = await req.json();

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        forUserId,
      },
    });

    const userData: { username: string; avatarURL: string; fromUserId: string; }[] = [];
    await Promise.all(
      notifications.map(async (notif) => {
        const user = await clerkClient.users.getUser(notif.fromUserId);
        userData.push({
          username: user.firstName + " " + user.lastName,
          avatarURL: user.imageUrl,
          fromUserId: notif.fromUserId
        });
      })
    );

    return new Response(JSON.stringify({ msg: 'success [200]', notifications, userData }), { status: 200 });

  } catch (e) {
    console.log(e);
    return new Response(
      JSON.stringify({ msg: "failed to get [500]", error: e }),
      { status: 500 }
    );
  }
}
