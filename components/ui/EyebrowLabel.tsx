import React from 'react';

interface EyebrowLabelProps {
  children: React.ReactNode;
  className?: string;
}

export default function EyebrowLabel({ children, className = '' }: EyebrowLabelProps) {
  return (
    <span className={`text-[11px] font-body uppercase tracking-[0.2em] text-gold font-medium block ${className}`}>
      {children}
    </span>
  );
}
