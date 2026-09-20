"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { orchestrateGsap } from "./gsap-orchestrator";

export const GsapProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;
    return orchestrateGsap(wrapperRef.current);
  }, [pathname]);

  return (
    <div ref={wrapperRef} className="w-full min-h-screen">
      <div className="page-wrapper bg-[#0C1A14]">{children}</div>
    </div>
  );
};
