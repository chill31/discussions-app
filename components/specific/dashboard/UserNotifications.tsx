"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Notification } from "@prisma/client";
import { Chip } from "@nextui-org/chip";
import Button from "@/components/ui/Button";
import { BsBoxArrowUpRight, BsPencilSquare, BsTrash } from "react-icons/bs";
import { useRouter } from "next/navigation";

import ReactMarkdown from "react-markdown";
import { User } from "@nextui-org/user";

type UserData = { username: string; avatarURL: string; fromUserId: string }

export default function UserNotifications({
  userId,
  URL,
}: {
  userId: string;
  URL: string;
}) {
  const router = useRouter();

  const [isFetching, setIsFetching] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userData, setUserData] = useState<UserData[]>();
  const [deleteButtonLoading, setDeleteButtonLoading] = useState(false);

  useEffect(() => {
    fetch(URL + "/api/notification/get", {
      method: "POST",
      body: JSON.stringify({ forUserId: userId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.msg.endsWith("[200]")) {
          setNotifications(data.notifications);
          setUserData(data.userData);
        } else {
          toast.error("Error retrieving discussions. Please try again later.");
        }
        setIsFetching(false);
      });
  }, [URL, userId]);

  if (isFetching) {
    return (
      <p className="dark:text-gray-300 text-gray-600 max-sm:text-center">
        Getting your notifications....
      </p>
    );
  }

  if (notifications.length === 0) {
    return (
      <p className="dark:text-gray-300 text-gray-600 max-sm:text-center">
        You have no notifications.
      </p>
    );
  }

  function deleteNotification(id: string) {
    setDeleteButtonLoading(true);
    fetch(URL + "/api/notification/delete", {
      method: "POST",
      body: JSON.stringify({ notificationId: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.msg.endsWith("[200]")) {
          setNotifications(
            notifications.filter((notification) => notification.id !== id)
          );
        } else {
          toast.error("Error deleting notification. Please try again later.");
        }
        setDeleteButtonLoading(false);
      });
  }

  function markAsRead(id: string) {
    fetch(URL + "/api/notification/mark-read", {
      method: "POST",
      body: JSON.stringify({ notificationId: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.msg.endsWith("[200]")) {
          setNotifications(
            notifications.map((notification) => {
              if (notification.id === id) {
                notification.read = true;
              }
              return notification;
            })
          );
        } else {
          toast.error("Error marking notification as read. Please try again later.");
        }
      });
  }

  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.read && !b.read) {
      return 1;
    }
    if (!a.read && b.read) {
      return -1;
    }
    return 0;
  });

  return (
    <div className="flex flex-col w-screen gap-6 max-sm:items-center max-sm:justify-center mr-4 mt-5">
      {sortedNotifications.map((notification: Notification, k: number) => (
        <div
          key={k}
          className={`px-2 py-4 flex flex-col gap-4 items-start justify-start rounded-lg w-[35rem] max-w-[calc(100vw-2rem)] ${notification.read ? 'dark:bg-white/10 bg-zinc-300' : 'dark:bg-primary-100 bg-primary-200'}`}
        >
          <span className="font-semibold dark:text-gray-300 text-gray-700">From</span>
          <User name={userData?.find((data, i) => i === k)?.username} avatarProps={{
            src: userData?.find((data, i) => i === k)?.avatarURL
          }} className="bg-white/20 p-2 w-full justify-start overflow-hidden" />
          <br />
          <br />
          {notification.read ? (
            <Chip size="lg" color='primary'>Read</Chip>
          ) : (
            <Chip color="danger" size="lg">
              Active
            </Chip>
          )}
          <p className="dark:text-gray-300 text-gray-700 mt-4 prose dark:prose-invert prose-blue prose-sm h-20 overflow-y-scroll">
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
            >
              {notification.content}
            </ReactMarkdown>
          </p>

          <div className="self-end flex items-center justify-end gap-1 w-full relative">
            {notification.read ? null : (
            <Button className="absolute left-0" onClick={() => markAsRead(notification.id)}>Mark as Read</Button>
            )}
            <Button
              color="danger"
              isIconOnly={true}
              isLoading={deleteButtonLoading}
              onClick={() => deleteNotification(notification.id)}
            >
              <BsTrash />
            </Button>
            <Button
              color="primary"
              isIconOnly={true}
              onClick={() => router.push(`/discussion/${notification.discussionId}`)}
            >
              <BsBoxArrowUpRight />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
