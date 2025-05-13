import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Welcome() {
  const session = await auth.api.getSession({ headers: await headers() });
  const isFirstAccess = !session?.user.username;

  if (isFirstAccess) redirect("/first-access");

  return <h1>Você está logado</h1>;
}
