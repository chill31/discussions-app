import Container from "@/components/page/Container";
import Button from "@/components/ui/Button";
import Title from "@/components/ui/Title";
import Link from "next/link";

export default function NotFound() {
  return (
    <Container>
      <Title>404</Title>
      <Button className="p-0">
        <Link href="/" className="w-full h-full flex items-center justify-center p-4">Back Home</Link>
      </Button>
    </Container>
  );
}
