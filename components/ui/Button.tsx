'use client';

import {Button as Btn, ButtonProps} from '@nextui-org/button';

export default function Button(props: ButtonProps) {
  return <Btn radius='sm' {...props}>{props.children}</Btn>
}