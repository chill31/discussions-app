"use client";

import { Comment, Discussion } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  BsCheck2Circle,
  BsExclamationCircle,
  BsPlus,
  BsTrash,
} from "react-icons/bs";
import Button from "./Button";
import { Textarea } from "@nextui-org/input";

import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import { User } from "@nextui-org/user";
import { useUser } from "@clerk/nextjs";
import { Chip } from "@nextui-org/chip";
import { useRouter } from "next/navigation";

export default function Comments({
  id,
  URL,
  discussion,
}: {
  id: string;
  URL: string;
  discussion: Discussion;
}) {
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  const [isError, setIsError] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [userData, setUserData] = useState<
    { name: string; avatarURL: string; commentId: string }[]
  >([]);

  const [commentFormVisible, setCommentFormVisible] = useState(false);

  const [commentContent, setCommentContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [commentButtonLoading, setCommentButtonLoading] = useState(false);

  useEffect(() => {
    fetch(URL + "/api/comments/get", {
      method: "POST",
      body: JSON.stringify({ id }),
      cache: "no-cache",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.msg.endsWith("[200]")) {
          setIsLoading(false);
          setComments(data.comments);
          setUserData(data.userData);
        } else {
          setIsError(true);
        }
      });
  }, [URL, id]);

  if (isLoading) {
    return <span className="!mt-10">Loading comments</span>;
  }

  if (isError) {
    return (
      <span className="not-prose text-red-500">
        <BsExclamationCircle /> Error loading comments. Try reloading the page
      </span>
    );
  }

  function addComment() {
    if (commentContent.length < 1)
      return toast.error("Comment cannot be empty");
    setCommentButtonLoading(true);
    fetch(URL + "/api/comments/add", {
      method: "POST",
      body: JSON.stringify({ discussionId: id, content: commentContent }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.msg.endsWith("[200]")) {
          toast.success("Comment added successfully");
          setComments((prev) => [...prev, data.comment]);
          setUserData((prev) => [...prev, data.userData]);
        } else {
          toast.error("Could not add comment");
        }

        setCommentButtonLoading(false);
        setCommentFormVisible(false);
      });
  }

  function deleteComment(id: string) {
    fetch(URL + "/api/comments/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.msg.endsWith("[200]")) {
          toast.success("Comment deleted successfully");
          setComments((prev) => prev.filter((comment) => comment.id !== id));
          setUserData((prev) => prev.filter((data) => data.commentId !== id));
        } else {
          toast.error("Could not delete comment");
        }
      });
  }

  function makeClosed(discussionId: string, commentId: string) {
    if (commentId === "_") {
      fetch(URL + "/api/discussion/close-no-comment", {
        method: "POST",
        body: JSON.stringify({ id: discussionId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.msg.endsWith("[200]")) {
            toast.success("Discussion closed successfully");
            router.refresh();
          } else {
            toast.error("Could not close discussion");
          }
        });
    } else {
      fetch(URL + "/api/discussion/close", {
        method: "POST",
        body: JSON.stringify({ id: discussionId, commentId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.msg.endsWith("[200]")) {
            toast.success("Discussion closed successfully");

            setComments((prev) =>
              prev.map((comment) => {
                if (comment.id === commentId) {
                  return { ...comment, isCloseComment: true };
                } else {
                  return comment;
                }
              })
            );
            router.refresh();
          } else {
            toast.error("Could not close discussion");
          }
        });
    }
  }

  return (
    <div className="flex flex-col items-start justify-start gap-4">
      {/* COMMENTS MAP */}
      {comments.map((comment, k: number) => (
        <div
          className={`flex flex-col border-2 border-transparent items-start justify-start gap-4 dark:bg-white/10 bg-zinc-300 py-4 rounded-md px-2 w-full ${
            comment.isCloseComment
              ? "border-black !bg-blue-400 dark:!bg-blue-600"
              : ""
          }`}
          key={k}
        >
          <User
            name={
              userData.find((data: any) => data.commentId === comment.id)?.name
            }
            avatarProps={{
              src: userData.find((data: any) => data.commentId === comment.id)
                ?.avatarURL,
            }}
          ></User>
          <ReactMarkdown
            allowedElements={[
              "p",
              "a",
              "b",
              "strong",
              "i",
              "em",
              "strikethrough",
              "code",
              "pre",
            ]}
            className="max-h-[10rem] overflow-y-scroll"
          >
            {comment.content}
          </ReactMarkdown>
          <div className="self-end flex gap-2 items-center justify-start">
            {discussion.authorId === user?.id ? (
              !discussion.closed ? (
                <Button
                  color="secondary"
                  onClick={() => makeClosed(discussion.id, comment.id)}
                >
                  <BsCheck2Circle className="text-xl" /> Close with comment
                </Button>
              ) : (
                <Chip
                  color="secondary"
                  size="lg"
                  className={`${comment.isCloseComment ? "" : "hidden"}`}
                >
                  {comment.isCloseComment ? "Marked as closing comment" : ""}
                </Chip>
              )
            ) : null}
            {comment.authorId === user?.id ? (
              <Button
                isIconOnly={true}
                color="danger"
                onClick={() => deleteComment(comment.id)}
              >
                <BsTrash />
              </Button>
            ) : null}
          </div>
        </div>
      ))}

      {/* COMMENT FORM LOGIC */}
      {commentFormVisible === false ? (
        isSignedIn &&
        (!discussion.closed ? (
          <Button
            color="primary"
            className="mt-6"
            onClick={() => setCommentFormVisible(true)}
          >
            <BsPlus /> Add a comment
          </Button>
        ) : (
          <span>Discussion is closed. You cannot add anymore comments</span>
        ))
      ) : (
        <Button color="danger" onClick={() => setCommentFormVisible(false)}>
          Cancel
        </Button>
      )}

      {/* ACTUAL COMMENT FORM ELEMENT */}
      <div
        className={`${
          commentFormVisible ? "flex" : "hidden"
        } flex-col items-start justify-start gap-2 mt-4 w-[50%] min-w-[16rem] py-4 pr-2`}
      >
        <Textarea
          className="w-[100%]"
          value={commentContent}
          onChange={(e) => {
            setCommentContent(e.target.value);
          }}
          radius="sm"
          placeholder="enter your comment"
          maxLength={500}
          maxRows={15}
        />
        <Button
          color="primary"
          className="self-end"
          onClick={addComment}
          isLoading={commentButtonLoading}
        >
          Confirm
        </Button>
      </div>

      {discussion.closed ? null : (
        <Button
          color="secondary"
          onClick={() => makeClosed(discussion.id, "_")}
          className="mt-12 self-center"
        >
          Close without comment
        </Button>
      )}
    </div>
  );
}
