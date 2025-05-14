import { saveTodo } from "@/actions/todo";
import { SelectTodo } from "@/db/schema";
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
      //TODO: Fix this
      return saveTodo(data);
    },
    onMutate: async ({ data }) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const previousTodos = queryClient.getQueryData(["todos"]);

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
