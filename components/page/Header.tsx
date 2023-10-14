"use client";

import Button from "@/components/ui/Button";
import { BsHouse, BsGear } from "react-icons/bs";
import { LuLogIn } from "react-icons/lu";

import { useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import ThemeButton from "./ThemeButton";
import { useEffect, useState } from "react";
import { Badge } from "@nextui-org/badge";
import { Notification } from "@prisma/client";

export default function Header() {
  const router = useRouter();
  const { user } = useUser();

  const [badgeInvisible, setBadgeInvisible] = useState(true);
  const [notificationsAmount, setNotificationsAmount] = useState(0);

  function redirect(url: string) {
    if (window.location.pathname === url) return;
    router.push(url);
  }

  function getNotifications() {
    if (!user) return;

    fetch("/api/notification/get", {
      method: "POST",
      body: JSON.stringify({ forUserId: user?.id }),
      cache: 'no-cache'
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.msg.endsWith("[200]")) {
          const activeNotifications = data.notifications.filter(
            (notification: Notification) => notification.read === false
          );
          setBadgeInvisible(activeNotifications.length === 0);
          setNotificationsAmount(activeNotifications.length);
        }
      });
  }
  getNotifications();

  return (
    <header className="flex items-center justify-end gap-2 w-screen py-6 px-6 max-sm:justify-center max-sm:gap-4 max-sm:px-0 header">
      <Button
        isIconOnly={true}
        onPress={() => redirect("/")}
        className="text-lg"
      >
        <BsHouse />
      </Button>
      <Badge isInvisible={badgeInvisible} content={notificationsAmount} color="primary">
        <Button
          isIconOnly={true}
          onPress={() => redirect("/dashboard")}
          className="text-lg"
        >
          <BsGear />
        </Button>
      </Badge>
      <ThemeButton />
      {user !== null ? (
        <UserButton />
      ) : (
        <Button onPress={() => redirect("/login")} isIconOnly={true}>
          <LuLogIn />
        </Button>
      )}
    </header>
  );
}
