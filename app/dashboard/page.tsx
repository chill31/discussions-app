import Container from "@/components/page/Container";
import NewDiscussionBtn from "@/components/specific/dashboard/newDiscussBtn";
import Button from "@/components/ui/Button";
import Paragraph from "@/components/ui/Paragraph";
import Title from "@/components/ui/Title";
import { UserProfile } from "@clerk/nextjs";
import { BsPlus } from "react-icons/bs";

export default function Dashboard() {
  return (
    <Container>
      <div className="flex flex-col items-center justify-start gap-4">
        <Title>Dashboard</Title>
        <Paragraph>
          Manage your account, discussions and see notifications.
        </Paragraph>
      </div>

      <NewDiscussionBtn />

      <div className="flex flex-col w-full overflow-x-hidden items-start justify-start gap-4 pl-4 max-sm:items-center max-sm:justify-center">
        <h2 className="text-[2.3rem] max-sm:text-[2rem] font-bold max-sm:text-center">My Discussions</h2>
        <p className="dark:text-gray-300 text-gray-600 max-sm:text-center">You have no current discussions.</p>
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
