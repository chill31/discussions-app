'use client';

import Button from "./Button";
import { useRouter } from "next/navigation";

import { ButtonProps } from "@nextui-org/button";

type ButtonPropsWithRedirect = ButtonProps & {href: string}

export default function RedirectButton(props: ButtonPropsWithRedirect) {
  const router = useRouter();
  return <Button onPress={() => router.push(props.href)} {...props}>{props.children}</Button>
}