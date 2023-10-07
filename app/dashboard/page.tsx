import Container from "@/components/page/Container";
import UserDiscussions from "@/components/specific/dashboard/UserDiscussions";
import NewDiscussionBtn from "@/components/specific/dashboard/newDiscussBtn";
import Paragraph from "@/components/ui/Paragraph";
import RedirectButton from "@/components/ui/RedirectButton";
import Title from "@/components/ui/Title";
import { UserProfile, currentUser } from "@clerk/nextjs";
import { BsPlus } from "react-icons/bs";

export default async function Dashboard() {

  const user = await currentUser();

  return (
    <Container>
      <div className="flex flex-col items-center justify-start gap-4">
        <Title>Dashboard</Title>
        <Paragraph>
          Manage your account, discussions and see notifications.
        </Paragraph>
      </div>

      <RedirectButton href="/new-discussion" icon={<BsPlus />} text={"New Discussion"} />

      <div className="flex flex-col w-full overflow-x-hidden items-start justify-start gap-4 pl-4 max-sm:items-center max-sm:justify-center">
        <h2 className="text-[2.3rem] max-sm:text-[2rem] font-bold max-sm:text-center">My Discussions</h2>
        <UserDiscussions userId={user?.id ?? ''} URL={process.env.URL ?? "https://chill31-discussions.vercel.app"} />
      </div>

      <div className="flex flex-col w-full overflow-x-hidden items-start justify-start gap-4 pl-4 max-sm:items-center max-sm:justify-center">
        <h2 className="text-[2.3rem] max-sm:text-[2rem] font-bold max-sm:text-center">Notifications</h2>
        <p className="dark:text-gray-300 text-gray-600 mr-2 max-sm:text-center">No notifications. Create a discussion, or contribute to others&apos; to recieve notifications about that discussion</p>
      </div>

      <div className="flex flex-col w-full overflow-x-hidden items-start justify-start gap-4 pl-4 max-sm:items-center max-sm:justify-center">
        <h2 className="text-[2.3rem] max-sm:text-[2rem] font-bold max-sm:text-center">Account</h2>
        <UserProfile />
      </div>
    </Container>
  );
}
