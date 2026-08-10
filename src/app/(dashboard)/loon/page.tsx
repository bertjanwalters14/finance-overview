import { redirect } from "next/navigation";

export default function LoonRedirect() {
  redirect("/vermogen?tab=loon");
}
