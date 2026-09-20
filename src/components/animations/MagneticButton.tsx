"use client";

import React from "react";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  strength = 0.3,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`motion-magnetic ${className}`}
      data-magnetic-strength={strength}
      {...props}
    >
      {children}
    </button>
  );
};
