import { saveTodo, updateStatus } from "@/actions/todo";
import { InsertTodo, SelectTodo, TodoStatus } from "@/db/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface TodoResponse {
  todos?: SelectTodo[];
  total?: number;
  cacheKey?: string;
}

type TodoFormData = Pick<InsertTodo, "title" | "description">;

export const useOptimisticTodoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TodoFormData) => {
      return saveTodo(data);
    },
    onMutate: async (data: TodoFormData) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const previousTodos = queryClient.getQueryData(["todos"]);
      console.log("Estado anterior:", previousTodos);

      queryClient.setQueryData(
        ["todos"],
        (old: TodoResponse | null | undefined) => {
          if (!old) return old;

          return {
            ...old,
            todos: [data, ...(old?.todos ?? [])],
            total: (old.total || 0) + 1,
          };
        }
      );
      return { previousTodos };
    },
    onError: (_, __, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(["todos"], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};

export const useOptimisticStatusTodoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: TodoStatus }) => {
      console.log("Chamando updateStatus");
      return updateStatus(id, status);
    },

    onMutate: async ({ id, status }) => {
      console.log("Mutação iniciada para ID:", id);
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const previousTodos = queryClient.getQueriesData({ queryKey: ["todos"] });
      console.log("Estado anterior:", previousTodos);

      queryClient.setQueriesData(
        { queryKey: ["todos"] },
        (old: TodoResponse | undefined) => {
          if (!old || !old.todos) return old;

          return {
            ...old,
            todos: old.todos.map((todo) =>
              todo.id === id ? { ...todo, status } : todo
            ),
          };
        }
      );

      return { previousTodos };
    },

    onError: (_, __, context) => {
      if (context?.previousTodos) {
        context.previousTodos.forEach(([queryKey, previousValue]) => {
          queryClient.setQueryData(queryKey, previousValue);
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};