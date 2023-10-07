'use client';

import Button from "./Button";
import { useRouter } from "next/navigation";

export default function RedirectButton({ href, text, icon }: { href: string; text: string; icon?: React.ReactNode }) {
  const router = useRouter();
  return <Button onClick={() => router.push(href)}>{icon} {text}</Button>
}