import Container from "@/components/page/Container";
import Comments from "@/components/ui/Comments";
import Paragraph from "@/components/ui/Paragraph";
import Prose from "@/components/ui/Prose";
import RedirectButton from "@/components/ui/RedirectButton";
import Title from "@/components/ui/Title";
import { Chip } from "@nextui-org/chip";
import { User } from "@nextui-org/user";
import { Discussion } from "@prisma/client";
import React from "react";

import ReactMarkdown from "react-markdown";

export default async function Discussion({
  params,
}: {
  params: { id: string };
}) {
  const res = await fetch(process.env.URL + "/api/discussion/get", {
    method: "POST",
    body: JSON.stringify({ id: params.id }),
    cache: "no-cache",
  });
  const data = await res.json();

  if (data.msg.endsWith("[500]")) {
    return (
      <Container>
        <Title>500</Title>
        <Paragraph>Internal server error.</Paragraph>
        <RedirectButton href="/">Back Home</RedirectButton>
      </Container>
    );
  }

  if (data.discussion === null) {
    return (
      <Container>
        <Title>404</Title>
        <Paragraph>Invalid discussion ID.</Paragraph>
        <RedirectButton href="/">Back Home</RedirectButton>
      </Container>
    );
  }

  return (
    <Container>
      <Prose>
        <h1>{data.discussion?.title}</h1>
        {data.discussion?.tags.map((tag: string, k: number) => (
          <span key={k}>
            <Chip size="lg"># {tag}</Chip>
            {k === data.discussion?.tags.length - 1 ? "" : "  "}
          </span>
        ))}
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <User
          name={data.userData.name}
          avatarProps={{ src: data.userData.avatarURL }}
          classNames={{
            name: "text-lg",
          }}
        />
        <br></br>
        created at{" "}
        <strong>
          {new Date(data.discussion?.created ?? new Date()).toLocaleString()}
        </strong>
        {data.discussion.closed ? (
          <>
            <br></br>
            <br></br>
            <Chip color="secondary" size='lg' className="!p-4">Closed</Chip>
          </>
        ) : null}
        <hr />
        <ReactMarkdown>{`${data.discussion?.content}
  `}</ReactMarkdown>
        <hr />
        <h1>Comments</h1>
        <Comments
          id={params.id}
          URL={process.env.URL ?? "https://chill31-discussions.vercel.app"}
          discussion={data.discussion}
        />
      </Prose>
    </Container>
  );
}
