import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { Button, Input } from "@repo/ui";
import { useLoginUser } from "../hooks/useLoginUser.js";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const navigate = useNavigate();

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const loginMutation = useLoginUser();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    loginMutation.mutate({
      email,
      password,
    });
  }

  return (
    <div
      className="
                h-screen w-screen flex items-center justify-center 
                p-4
                bg-primary-bg 
            "
    >
      <div
        className="
                    w-full max-w-md 
                    rounded-2xl border
                    bg-white
                    px-6 py-10
                    shadow-xl
                "
      >
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">Log In</h1>
          <p className="mt-2 text-gray-500">
            <i>Do not miss out</i>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            ref={(el) => {
              inputRefs.current[0] = el;
            }}
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && email.trim() !== "") {
                e.preventDefault();
                inputRefs.current[1]?.focus();
              }
            }}
          />

          <Input
            label="Password"
            ref={(el) => {
              inputRefs.current[1] = el;
            }}
            placeholder="******"
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && password.trim() !== "") {
                e.preventDefault();
                buttonRef.current?.focus();
              }
            }}
          />

          <Button
            ref={buttonRef}
            type="submit"
            size="xl"
            disabled={loginMutation.isPending || !isFormValid}
            className="mt-4"
          >
            {loginMutation.isPending ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div
          className="
                        mt-4 
                        text-center text-sm text-gray-500
                    "
        >
          Don't have an account?{" "}
          <Link
            to="/"
            className="
                            font-medium
                            text-primary-btn-bg
                            hover:underline
                        "
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
