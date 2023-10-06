'use client';

import { ClerkProvider as Cp } from "@clerk/nextjs";
import {useTheme} from 'next-themes'
import { dark } from "@clerk/themes";

export default function ClerkProvider({ children }: { children: React.ReactNode }) {

  const {theme} = useTheme();

  return (
    <>
      {theme === 'dark' ? <Cp appearance={{ baseTheme: dark }}>{children}</Cp> : <Cp>{children}</Cp>}
    </>
  )
}