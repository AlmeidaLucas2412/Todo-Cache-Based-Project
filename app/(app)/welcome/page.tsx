import { AddTodo } from "@/components/add-todo";
import { TodoListing } from "@/components/todo-listing";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Welcome() {
  const session = await auth.api.getSession({ headers: await headers() });
  const isFirstAccess = !session?.user.username;

  if (isFirstAccess) redirect("/first-access");

  return (
    <section className="flex flex-col px-6 gap-y-4 py-18">
      <h2 className="font-semibold text-lg">Que tal adicionar uma tarefa?</h2>
      <AddTodo />
      <TodoListing />
    </section>
  );
}
