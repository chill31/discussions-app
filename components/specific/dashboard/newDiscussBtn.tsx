"use client";

import Button from "@/components/ui/Button";
import { BsPlus } from "react-icons/bs";

import {useRouter} from 'next/navigation'

export default function NewDiscussionBtn() {

  const router = useRouter();

  function redirect() {
    router.push('/new-discussion');
  }

  return (
    <Button onPress={() => redirect()}>
      <BsPlus />
      New Discussion
    </Button>
  );
}
