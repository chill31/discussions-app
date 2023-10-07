"use client";

import Button from "@/components/ui/Button";
import { BsHouse, BsGear } from "react-icons/bs";
import { LuLogIn } from "react-icons/lu";

import { useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import ThemeButton from "./ThemeButton";

export default function Header() {
  const router = useRouter();
  const { user } = useUser();

  function redirect(url: string) {
    if (window.location.pathname === url) return;
    router.push(url);
  }

  return (
    <header className="flex items-center justify-end gap-2 w-screen py-6 px-6 max-sm:justify-center max-sm:gap-4 max-sm:px-0 header">
      <Button
        isIconOnly={true}
        onClick={() => redirect("/")}
        className="text-lg"
      >
        <BsHouse />
      </Button>
      <Button
        isIconOnly={true}
        onClick={() => redirect("/dashboard")}
        className="text-lg"
      >
        <BsGear />
      </Button>
      <ThemeButton />
      {user !== null ? (
        <UserButton />
      ) : (
        <Button onClick={() => redirect("/login")} isIconOnly={true}>
          <LuLogIn />
        </Button>
      )}
    </header>
  );
}
