import { redirect } from "next/navigation";

export default function AandelenRedirect() {
  redirect("/vermogen?tab=aandelen");
}
