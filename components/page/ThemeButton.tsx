"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Button from "@/components/ui/Button";
import { BsMoon, BsSun } from "react-icons/bs";

export default function ThemeButton() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;

  return (
    <Button onPress={() => {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }} isIconOnly={true} className="text-lg">
      {theme === 'dark' ? <BsMoon /> : <BsSun />}
    </Button>
  )
}
