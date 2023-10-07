'use client';

import React, { useEffect } from "react";

import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import typescript from 'highlight.js/lib/languages/typescript';
import css from 'highlight.js/lib/languages/css';

import '@/app/prose-styles.css'

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('css', css);

export default function Prose({ children }: { children: React.ReactNode }) {

  useEffect(() => {
      hljs.highlightAll();
  
      hljs.configure({
        ignoreUnescapedHTML: true,
      });
  }, []);

  return (
    <div className="w-full mt-5 prose dark:prose-invert prose-lg prose-blue !px-2 first-of-type:prose-h1:text-[3.6rem] max-sm:first-of-type:prose-h1:text-[3.2rem] last-of-type:prose-h1:text-[3.6rem] max-sm:last-of-type:prose-h1:text-[3.2rem]">{children}</div>
  )
}