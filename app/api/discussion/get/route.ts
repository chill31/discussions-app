import { clerkClient } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { id, getAll } = await req.json();
  if (!getAll) {
    try {
      const discussion = await prisma.discussion.findUnique({
        where: {
          id: id,
        },
      });

      let userData: {name: string; avatarURL: string} = {name: 'abc', avatarURL: 'abc.png'};
      if(discussion !== null) {
        const user = await clerkClient.users.getUser(discussion.authorId);
        userData.name = user.firstName + " " + user.lastName;
        userData.avatarURL = user.imageUrl;
      }

      return new Response(
        JSON.stringify({ msg: "found discussion [200]", discussion, userData }),
        { status: 200 }
      );
    } catch (e) {
      console.log(e);
      return new Response(
        JSON.stringify({ msg: "failed to get discussion [500]", error: e }),
        { status: 500 }
      );
    } finally {
      prisma.$disconnect();
    }
  } else if(getAll === true) {

    try {
      const discussions = await prisma.discussion.findMany({
        where: {
          unlisted: false
        }
      });

      return new Response(
        JSON.stringify({ msg: "found discussions [200]", discussions }),
        { status: 200 }
      );
    } catch (e) {
      console.log(e);
      return new Response(
        JSON.stringify({ msg: "failed to get discussions [500]", error: e }),
        { status: 500 }
      );
    } finally {
      prisma.$disconnect();
    }

  }
}
