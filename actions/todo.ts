"use server";

import {
  getTodoByUserId,
  updateTodoStatus,
  upsertTodo,
} from "@/db/queries/todo";
import { InsertTodo, SelectTodo, TodoStatus } from "@/db/schema";
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
    if(!data.title) return { success: false, error: "Título é obrigatório" };
    
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

export const updateStatus = async (
  id: string,
  status: TodoStatus
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    await updateTodoStatus(id, status);
    return { success: true };
  } catch (error) {
    console.error("Falha ao atualizar status da tarefa", error);
    return { success: false, error: "Falha ao atualizar status da tarefa" };
  }
};
