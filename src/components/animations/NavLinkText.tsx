import React from "react";

export const NavLinkText: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <span className="link-text-wrapper">
    <span className="nav-item-discrete link-text-inner">{children}</span>
  </span>
);
