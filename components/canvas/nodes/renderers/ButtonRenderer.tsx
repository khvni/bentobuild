import React from 'react';
import { ButtonComponent } from '@/types/canvas.types';

interface Props {
  data: ButtonComponent;
}

export default function ButtonRenderer({ data }: Props) {
  const variantStyles = {
    filled: 'bg-bauhaus-blue text-white border-2 border-black',
    outlined: 'bg-transparent border-2 border-bauhaus-blue text-bauhaus-blue',
    text: 'bg-transparent text-bauhaus-blue',
  };

  return (
    <button
      className={`
        px-4 py-2 rounded-bauhaus-md font-semibold text-sm
        transition-all duration-200
        ${variantStyles[data.content.variant]}
      `}
      style={{
        backgroundColor: data.content.variant === 'filled' ? data.style.backgroundColor : undefined,
        color: data.style.textColor,
        borderColor: data.content.variant === 'outlined' ? data.style.backgroundColor : undefined,
      }}
      onClick={(e) => e.preventDefault()}
    >
      {data.content.text || 'Button'}
    </button>
  );
}
