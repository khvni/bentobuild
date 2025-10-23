import React from 'react';
import { HeadingComponent } from '@/types/canvas.types';

interface Props {
  data: HeadingComponent;
}

export default function HeadingRenderer({ data }: Props) {
  const sizeMap: Record<number, string> = {
    1: 'text-4xl',
    2: 'text-3xl',
    3: 'text-2xl',
    4: 'text-xl',
    5: 'text-lg',
    6: 'text-base',
  };

  const className = `font-bold ${sizeMap[data.content.level]} line-clamp-2`;
  const style = {
    color: data.style.textColor,
    fontFamily: data.style.fontFamily,
  };

  const content = data.content.text || 'Heading';

  // Render the appropriate heading level
  switch (data.content.level) {
    case 1:
      return <h1 className={className} style={style}>{content}</h1>;
    case 2:
      return <h2 className={className} style={style}>{content}</h2>;
    case 3:
      return <h3 className={className} style={style}>{content}</h3>;
    case 4:
      return <h4 className={className} style={style}>{content}</h4>;
    case 5:
      return <h5 className={className} style={style}>{content}</h5>;
    case 6:
      return <h6 className={className} style={style}>{content}</h6>;
    default:
      return <h2 className={className} style={style}>{content}</h2>;
  }
}
