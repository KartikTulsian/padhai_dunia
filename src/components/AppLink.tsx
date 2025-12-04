"use client";

import Link, { LinkProps } from "next/link";
import React from "react";
import { useLoader } from "./LoaderProvider";

type AppLinkProps = LinkProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    children: React.ReactNode;
  };

export default function AppLink({ onClick, children, ...rest }: AppLinkProps) {
  const { start } = useLoader();

  return (
    <Link
      {...rest}
      onClick={(e) => {
        // start the loader immediately
        start();

        // preserve any existing onClick logic
        if (onClick) {
          onClick(e);
        }
      }}
    >
      {children}
    </Link>
  );
}
