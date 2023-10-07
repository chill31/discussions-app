"use client";

import Container from "@/components/page/Container";
import Button from "@/components/ui/Button";
import Paragraph from "@/components/ui/Paragraph";
import Title from "@/components/ui/Title";
import { Discussion } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import ReactMarkdown from "react-markdown";

export default function Discussion({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isNull, setIsNull] = useState(true);
  const [discussion, setDiscussion] = useState<Discussion>();

  useEffect(() => {
    const hostScheme =
      window.location.host === "localhost:3000" ? "http://" : "https://";
    fetch(hostScheme + window.location.host + "/api/discussion/get", {
      method: "POST",
      body: JSON.stringify({ id: params.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.msg.endsWith("[500]")) {
          setIsNull(true);
        } else {
          if (data.discussion === null) {
            setIsNull(true);
            return setIsLoading(false);
          }
          setIsNull(false);
          setIsLoading(false);
          setDiscussion(data.discussion);
        }
      });
  });

  if (isLoading) {
    return (
      <Container>
        <Title>Loading...</Title>
      </Container>
    );
  }

  if (isNull) {
    return (
      <Container>
        <Title>404</Title>
        <Paragraph>Invalid discussion ID.</Paragraph>
        <Button onClick={() => router.push("/")}>Home</Button>
      </Container>
    );
  }

  return (
    <Container>
      <div className="w-full mt-5 prose dark:prose-invert prose-lg prose-blue !px-2">
        <ReactMarkdown>{`# ${discussion?.title}
---
        
        
${discussion?.content}`}</ReactMarkdown>
      </div>
    </Container>
  );
}
