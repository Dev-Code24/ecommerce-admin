"use client";
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({ ignoredRoutes: ["/favicon.ico"] });

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
