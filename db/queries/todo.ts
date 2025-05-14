import { and, count, eq, ilike } from "drizzle-orm";
import db from "..";
import { InsertTodo, SelectTodo, todos } from "../schema";

export const upsertTodo = async (data: InsertTodo): Promise<SelectTodo> => {
  const result = await db
    .insert(todos)
    .values(data)
    .onConflictDoUpdate({
      target: todos.id,
      set: data,
    })
    .returning();

  if (!result || result.length === 0)
    throw new Error("Falha ao salvar ou atualizar tarefa");

  return result[0];
};

export const getTodoByUserId = async (
  userId: string,
  page = 1,
  pageSize = 10,
  title?: string
) => {
  const result = await db.query.todos.findMany({
    orderBy: (todos, { asc }) => asc(todos.updatedAt),
    limit: pageSize,
    offset: (page - 1) * pageSize,
    where: title
      ? and(eq(todos.userId, userId), ilike(todos.title, `%${title}%`))
      : eq(todos.userId, userId),
  });

  const total = await db
    .select({ count: count() })
    .from(todos)
    .where(
      title
        ? and(eq(todos.userId, userId), ilike(todos.title, `%${title}%`))
        : eq(todos.userId, userId)
    );

  return {
    todos: result ?? [],
    total: total[0].count ?? 0,
  };
};
