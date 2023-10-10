import Container from "@/components/page/Container";
import UserDiscussions from "@/components/specific/dashboard/UserDiscussions";
import UserNotifications from "@/components/specific/dashboard/UserNotifications";
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

      <RedirectButton href="/new-discussion" size='md'><BsPlus /> New Discussion</RedirectButton>

      <div className="flex flex-col w-full overflow-x-hidden items-start justify-start gap-4 pl-4 max-sm:items-center max-sm:justify-center">
        <h2 className="text-[2.3rem] max-sm:text-[2rem] font-bold max-sm:text-center">My Discussions</h2>
        <UserDiscussions userId={user?.id ?? ''} URL={process.env.URL ?? "https://chill31-discussions.vercel.app"} />
      </div>

      <div className="flex flex-col w-full overflow-x-hidden items-start justify-start gap-4 pl-4 max-sm:items-center max-sm:justify-center">
        <h2 className="text-[2.3rem] max-sm:text-[2rem] font-bold max-sm:text-center">Notifications</h2>
        <UserNotifications URL={process.env.URL ?? 'https://chill31-discussions.vercel.app'} userId={user?.id ?? ""} />
      </div>

      <div className="flex flex-col w-full overflow-x-hidden items-start justify-start gap-4 pl-4 max-sm:items-center max-sm:justify-center">
        <h2 className="text-[2.3rem] max-sm:text-[2rem] font-bold max-sm:text-center">Account</h2>
        <UserProfile />
      </div>
    </Container>
  );
}
