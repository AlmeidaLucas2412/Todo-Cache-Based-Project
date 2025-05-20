import { saveTodo, updateStatus } from "@/actions/todo";
import { SelectTodo, TodoStatus } from "@/db/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface TodoResponse {
  todos?: SelectTodo[];
  total?: number;
  cacheKey?: string;
}

export const useOptimisticTodoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      return saveTodo(data);
    },
    onMutate: async ({ data }) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const previousTodos = queryClient.getQueryData(["todos"]);
      console.log("Estado anterior:", previousTodos);

      queryClient.setQueryData(
        ["todos"],
        (old: TodoResponse | null | undefined) => {
          if (!old) return old;

          return {
            ...old,
            todos: [data, ...(old?.todos || [])].slice(0, old.todos?.length),
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

      const previousTodos = queryClient.getQueryData(["todos"]);
      console.log("Estado anterior:", previousTodos);

      queryClient.setQueryData(["todos"], (oldTodos: any) => {
        const updatedTodos = oldTodos.map((todo: any) =>
          todo.id === id ? { ...todo, status } : todo
        );
        console.log("Estado atualizado:", updatedTodos);
        return updatedTodos;
      });

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
