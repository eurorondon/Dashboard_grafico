"use client";
import { SignIn, useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function Page() {
  const { isSignedIn, user } = useUser();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <SignIn
        fallbackRedirectUrl="/trading"
        signUpFallbackRedirectUrl="/trading"
      />
    </div>
  );
}
