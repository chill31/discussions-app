import Container from "@/components/page/Container";
import DiscussionsList from "@/components/specific/home/DiscussionsList";
import Paragraph from "@/components/ui/Paragraph";
import Title from "@/components/ui/Title";

export default function Home() {
  return (
    <Container>
      <div className="flex flex-col items-center justify-start gap-4">
        <Title>Discussions</Title>
        <Paragraph>
          search topics to discuss and view. Log in to create or contribute to
          discussions.
        </Paragraph>

        <div className="w-screen flex flex-col gap-16 items-start justify-start">
          <h2 className="self-start ml-4 mt-12 text-[2rem] font-bold">
            Search
          </h2>
          <DiscussionsList
            URL={process.env.URL ?? "https://chill31-discussions.vercel.app"}
          />
        </div>
      </div>
    </Container>
  );
}
