import Container from "@/components/page/Container";
import EditDiscussionForm from "@/components/specific/editDiscussion/editDiscussionForm";
import Paragraph from "@/components/ui/Paragraph";
import Title from "@/components/ui/Title";
import { currentUser } from "@clerk/nextjs"

export default async function NewDiscussion({ params }: { params: { id: string } }) {

  const user = await currentUser();
  if(user === null) {

    return (
      <Container>
        <Title>401</Title>
        <Paragraph>You are not logged in to edit this discussion</Paragraph>
      </Container>
    )

  }

  const res = await fetch(process.env.URL + '/api/discussion/checkOwnership', {
    method: 'POST',
    body: JSON.stringify({ discussionId: params.id, authorId: user.id}),
  });
  const data = await res.json();

  if(data.isOwner) {
    return <EditDiscussionForm id={params.id} URL={process.env.URL ?? 'https://chill31-discussions.vercel.app'} defaultData={{
      content: data.discussion.content,
      title: data.discussion.title,
      tags: data.discussion.tags,
      unlisted: data.discussion.unlisted
    }} />
  } else {

    return (
      <Container>
        <Title>401</Title>
        <Paragraph>You cannot edit this discussion as someone else has created this</Paragraph>
      </Container>
    )

  }

}
