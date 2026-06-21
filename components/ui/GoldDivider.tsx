import React from 'react';

interface GoldDividerProps {
  className?: string;
}

export default function GoldDivider({ className = '' }: GoldDividerProps) {
  return (
    <hr className={`border-t border-gold/30 my-6 ${className}`} />
  );
}
