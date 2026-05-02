"use client";

import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <form className="dashboard-list" onSubmit={submit}>
      <label>
        Email
        <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label>
        Password
        <input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>
      <button className="button primary" disabled={isPending} type="submit">
        Sign in
      </button>
      {message ? <p className="danger">{message}</p> : null}
    </form>
  );
}
