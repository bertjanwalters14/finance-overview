"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="self-start rounded-lg bg-slate-100 px-4 py-2 font-medium text-slate-900 transition hover:bg-white disabled:opacity-50"
    >
      {pending ? "Opslaan..." : children}
    </button>
  );
}
