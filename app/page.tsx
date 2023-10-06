import Container from "@/components/page/Container";
import Paragraph from "@/components/ui/Paragraph";
import Title from "@/components/ui/Title";

export default function Home() {
  return (
    <Container>
      <div className="flex flex-col items-center justify-start gap-4">
        <Title>Discussions</Title>
        <Paragraph>search topics to discuss and view. Log in to create or contribute to discussions.</Paragraph>
      </div>
    </Container>
  );
}
