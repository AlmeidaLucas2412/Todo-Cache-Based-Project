"use server";

import { getTodoByUserId, upsertTodo } from "@/db/queries/todo";
import { InsertTodo, SelectTodo } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export type IncomingTodoData = Pick<InsertTodo, "title" | "description">;

export const saveTodo = async (
  data: IncomingTodoData
): Promise<{
  success: boolean;
  todo?: SelectTodo;
  error?: string;
}> => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user.id || "";

    if (!userId) return { success: false, error: "Usuário não encontrado" };

    const now = new Date();

    const dataToInsert: InsertTodo = {
      ...data,
      userId,
      status: "todo",
      createdAt: now,
      updatedAt: now,
    };

    const updatedTodo = await upsertTodo(dataToInsert);

    return { success: true, todo: updatedTodo };
  } catch (error) {
    console.error("Falha ao adicionar tarefa", error);
    return { success: false, error: "Falha ao adicionar tarefa" };
  }
};

export const listTodos = async (
  page = 1,
  pageSize = 10,
  title?: string
): Promise<{ todos: SelectTodo[]; total: number } | null> => {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id || "";

  if (!userId) return null;

  return await getTodoByUserId(userId, page, pageSize, title);
};
