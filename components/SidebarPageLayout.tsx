import React from "react";

export default function SidebarPageLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`p-8 flex-1 flex flex-col bg-[#F9FBFD] ${className}`}>
      {children}
    </div>
  );
}
