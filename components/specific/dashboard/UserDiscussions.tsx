"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Discussion } from "@prisma/client";
import { showTruncated } from "@/helpers/showTruncated";
import { Chip } from "@nextui-org/chip";
import Button from "@/components/ui/Button";
import { BsBoxArrowUpRight, BsPencilSquare, BsTrash } from "react-icons/bs";
import { useRouter } from "next/navigation";

import ReactMarkdown from "react-markdown";

export default function UserDiscussions({
  userId,
  URL,
}: {
  userId: string;
  URL: string;
}) {
  const router = useRouter();

  const [isFetching, setIsFetching] = useState(true);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [deleteButtonLoading, setDeleteButtonLoading] = useState(false);

  useEffect(() => {
    fetch(URL + "/api/discussion/user", {
      method: "POST",
      body: JSON.stringify({ userId: userId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.msg.endsWith("[200]")) {
          setDiscussions(data.discussions);
        } else {
          toast.error("Error retrieving discussions. Please try again later.");
        }
        setIsFetching(false);
      });
  }, [URL, userId]);

  if (isFetching) {
    return (
      <p className="dark:text-gray-300 text-gray-600 max-sm:text-center">
        Getting your discussions....
      </p>
    );
  }

  if (discussions.length === 0) {
    return (
      <p className="dark:text-gray-300 text-gray-600 max-sm:text-center">
        You have no current discussions.
      </p>
    );
  }

  function deleteDiscussion(discussionId: string) {
    setDeleteButtonLoading(true);
    fetch(URL + "/api/discussion/delete", {
      method: "POST",
      body: JSON.stringify({ id: discussionId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.msg.endsWith("[200]")) {
          toast.success("Discussion deleted");
          router.back();
          router.forward();
        } else {
          toast.error("Could not delete discussion");
        }

        setDeleteButtonLoading(false);
      });
  }

  return (
    <div className="flex flex-col w-screen gap-6 max-sm:items-center max-sm:justify-center mr-4 mt-5">
      {discussions.map((discussion: Discussion, k: number) => (
        <div
          key={k}
          className="px-2 py-4 flex flex-col gap-4 items-start justify-start rounded-lg dark:bg-white/10 bg-zinc-300 w-[35rem] max-w-[calc(100vw-2rem)]"
        >
          <h2 className="font-bold text-[1.6rem]">
            {showTruncated(discussion.title, 20)}
          </h2>
          {discussion.closed ? (
            <Chip color="warning" size="lg">
              Closed
            </Chip>
          ) : (
            <Chip color="success" size="lg">
              Open
            </Chip>
          )}
          {discussion.unlisted ? (
            <Chip color="warning" size="lg">
              Unlisted
            </Chip>
          ) : (
            <Chip color="success" size="lg">
              Public
            </Chip>
          )}
          <p className="dark:text-gray-300 text-gray-700 mt-4 prose dark:prose-invert prose-blue prose-sm h-40 overflow-y-scroll">
            <ReactMarkdown>{discussion.content}</ReactMarkdown>
          </p>

          <div className="flex flex-wrap items-center justify-start gap-3">
            <span>Tags:</span>
            {discussion.tags.map((tag: string, k: number) => (
              <span
                key={k}
                className="bg-blue-500 rounded-full py-1 px-4 text-white flex items-center justify-center gap-2"
              >
                # {tag}
              </span>
            ))}
          </div>
          <div className="self-end flex items-center justify-end gap-1">
            <Button
              color="danger"
              size="sm"
              isIconOnly={true}
              onClick={() => deleteDiscussion(discussion.id)}
              isLoading={deleteButtonLoading}
            >
              <BsTrash />
            </Button>
            <Button
              color="primary"
              size="sm"
              isIconOnly={true}
              onClick={() => router.push(`/discussion/${discussion.id}`)}
            >
              <BsBoxArrowUpRight />
            </Button>
            <Button
              size="sm"
              isIconOnly={true}
              color='primary'
              onClick={() => router.push(`/edit/${discussion.id}`)}
            >
              <BsPencilSquare />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
