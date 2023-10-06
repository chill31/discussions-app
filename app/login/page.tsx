import Container from "@/components/page/Container";
import Title from "@/components/ui/Title";
import { SignIn } from "@clerk/nextjs";

export default function LogIn() {
  return (
    <Container>
      <Title>Log in</Title>
      <SignIn afterSignInUrl={'/'} afterSignUpUrl={'/'} />
    </Container>
  )
}