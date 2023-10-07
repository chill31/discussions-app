import Container from "@/components/page/Container";
import Button from "@/components/ui/Button";
import Comments from "@/components/ui/Comments";
import Paragraph from "@/components/ui/Paragraph";
import Prose from "@/components/ui/Prose";
import RedirectButton from "@/components/ui/RedirectButton";
import Title from "@/components/ui/Title";
import { Comment, Discussion } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ReactMarkdown from "react-markdown";

export default async function Discussion({
  params,
}: {
  params: { id: string };
}) {
  //   const router = useRouter();
  //   const [isLoading, setIsLoading] = useState(true);
  //   const [isNull, setIsNull] = useState(true);
  //   const [discussion, setDiscussion] = useState<Discussion>();

  //   useEffect(() => {
  //     const hostScheme =
  //       window.location.host === "localhost:3000" ? "http://" : "https://";
  //     fetch(hostScheme + window.location.host + "/api/discussion/get", {
  //       method: "POST",
  //       body: JSON.stringify({ id: params.id }),
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         if (data.msg.endsWith("[500]")) {
  //           setIsNull(true);
  //         } else {
  //           if (data.discussion === null) {
  //             setIsNull(true);
  //             return setIsLoading(false);
  //           }
  //           setIsNull(false);
  //           setIsLoading(false);
  //           setDiscussion(data.discussion);
  //         }
  //       });
  //   });

  //   if (isLoading) {
  //     return (
  //       <Container>
  //         <Title>Loading...</Title>
  //       </Container>
  //     );
  //   }

  //   if (isNull) {
  //     return (
  //       <Container>
  //         <Title>404</Title>
  //         <Paragraph>Invalid discussion ID.</Paragraph>
  //         <Button onClick={() => router.push("/")}>Home</Button>
  //       </Container>
  //     );
  //   }

  //   return (
  //     <Container>
  //       <Prose>
  //         <ReactMarkdown>{`# ${discussion?.title}
  // **created at ${new Date(discussion?.created ?? new Date()).toLocaleString()}**

  // ---

  // ${discussion?.content}

  // ---

  // `}</ReactMarkdown>
  //         <Comments id={params.id} URL={process.env.URL ?? 'https://chill31-discussions.vercel.app'} />
  //       </Prose>
  //     </Container>
  //   );

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
        <RedirectButton href="/" text="Back Home" />
      </Container>
    );
  }

  if (data.discussion === null) {
    return (
      <Container>
        <Title>404</Title>
        <Paragraph>Invalid discussion ID.</Paragraph>
        <RedirectButton href="/" text="Back Home" />
      </Container>
    );
  }

  return (
    <Container>
      <Prose>
        <h1>{data.discussion?.title}</h1>
        <strong>
          created at{" "}
          {new Date(data.discussion?.created ?? new Date()).toLocaleString()}
        </strong>
        <p>
          Tags:{" "}
          {data.discussion?.tags.map((tag: string, k: number) => (
            <strong key={k}># {tag}{k === data.discussion?.tags.length - 1 ? "" : ", "}</strong>
          ))}
        </p>
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
