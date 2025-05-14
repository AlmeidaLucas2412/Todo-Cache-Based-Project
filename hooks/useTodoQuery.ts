import { listTodos } from "@/actions/todo";
import { useQuery } from "@tanstack/react-query";

const fetchTodos = async (page: number, pageSize: number, title?: string) => {
  const response = await listTodos(page, pageSize, title);
  return response;
};
export const useTodos = (page = 1, pageSize = 10, title?: string) => {
  return useQuery({
    queryKey: ["todos", page, pageSize, title],
    queryFn: () => fetchTodos(page, pageSize, title),
  });
};
