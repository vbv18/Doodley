import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { Button, Input } from "@repo/ui";
import { useRegisterUser } from "../hooks/useRegisterUser.js";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const navigate = useNavigate();

  const isFormValid =
    name.trim() !== "" && email.trim() !== "" && password.trim() !== "";

  const registerMutation = useRegisterUser();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    registerMutation.mutate(
      {
        name,
        email,
        password,
      },
      {
        onSuccess: () => {
          navigate("/dashboard");
        },
      },
    );
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
                    p-8
                    shadow-xl
                "
      >
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold">Create Account</h1>
          <p className="mt-2 text-gray-500">
            Join{" "}
            <i>
              <b>doodle.ai</b>
            </i>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Name"
            ref={(el) => {
              inputRefs.current[0] = el;
            }}
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && name.trim() !== "") {
                e.preventDefault();
                inputRefs.current[1]?.focus();
              }
            }}
          />

          <Input
            label="Email"
            ref={(el) => {
              inputRefs.current[1] = el;
            }}
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && email.trim() !== "") {
                e.preventDefault();
                inputRefs.current[2]?.focus();
              }
            }}
          />

          <Input
            label="Password"
            ref={(el) => {
              inputRefs.current[2] = el;
            }}
            placeholder="******"
            type="password"
            value={password}
            autoComplete="new-password"
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
            disabled={registerMutation.isPending || !isFormValid}
            className="mt-4"
          >
            {registerMutation.isPending ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>

        <div
          className="
                        mt-4 
                        text-center text-sm text-gray-500
                    "
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary-btn-bg hover:underline"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
