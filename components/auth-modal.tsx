"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface AuthModalProps {
  trigger?: React.ReactNode;
}

export default function AuthModal({ trigger }: AuthModalProps) {
  const [loading, setLoading] = useState<"google" | "github" | null>(null);
  const [open, setOpen] = useState(false);

  const handleOAuth = async (provider: "google" | "github") => {
    await signIn.social(
      {
        provider,
        callbackURL: "/",
      },
      {
        onRequest: () => setLoading(provider),
        onResponse: () => {
          setLoading(null);
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Sign In</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border-neutral-800">
        <div className="flex flex-col gap-2">
          <DialogTitle className="text-2xl font-semibold">Sign In</DialogTitle>
          <DialogDescription className="text-neutral-500">
            Choose your provider to continue.
          </DialogDescription>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <button
            disabled={loading !== null}
            onClick={() => handleOAuth("google")}
            className="flex w-full border-2 border-neutral-800 cursor-pointer bg-neutral-900 font-medium rounded-lg py-3 items-center justify-center gap-3"
          >
            {loading === "google" ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <Image
                  src={"/google.svg"}
                  alt={"logo"}
                  height={200}
                  width={200}
                  className="w-5"
                ></Image>
              </>
            )}
            <p className="font-medium">Sign in with Google</p>
          </button>

          <button
            disabled={loading !== null}
            onClick={() => handleOAuth("github")}
            className="flex w-full border-2 border-neutral-800 cursor-pointer bg-neutral-900 font-medium rounded-lg py-3 items-center justify-center gap-3"
          >
            {loading === "github" ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <Image
                  src={"/git.svg"}
                  alt={"logo"}
                  height={200}
                  width={200}
                  className="w-5"
                ></Image>
              </>
            )}
            <p className="font-medium">Sign in with GitHub</p>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
