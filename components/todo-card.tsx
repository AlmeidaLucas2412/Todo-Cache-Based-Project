"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Info,
  ListTodo,
  Pen,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { useTodos } from "@/hooks/useTodoQuery";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

export const TodoCard = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageParams = searchParams.get("page");
  const page = pageParams ? parseInt(pageParams) : 1;
  const pageSize = 2; //Paginação de 2 tarefas por vez cenário hipotetico

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const goToPage = (pageNumber: number) => {
    router.push(
      `${pathname}?${createQueryString("page", pageNumber.toString())}`
    );
  };

  const { data, isLoading, isPending, error } = useTodos(page, pageSize);

  const totalPages = Math.ceil((data?.total ?? 0) / pageSize);

  if (isLoading)
    return (
      <div className="flex flex-col gap-y-4">
        <Skeleton className="h-14 w-[calc(100dvw-4rem)] bg-gray-500/40 rounded-none" />
        <Skeleton className="h-14 w-[calc(100dvw-4rem)] bg-gray-500/40 rounded-none" />
      </div>
    );
  if (error) return <div>Erro ao carregar tarefas</div>;

  if (!data || !data.todos) return null;

  return (
    <>
      {data.todos.map((todo) => (
        <div
          className={cn(
            "flex justify-between border p-4 items-center",
            todo.status === "done" && "bg-green-300",
            todo.status === "excluded" && "bg-red-400"
          )}
          key={todo.id}
        >
          <div className="flex flex-col gap-y-2">
            <div className="flex gap-x-1 items-center">
              <ListTodo className="size-5" />
              <span
                className={
                  todo.status === "done" || todo.status === "excluded"
                    ? "line-through"
                    : ""
                }
              >
                {todo.title}
              </span>
            </div>
            {todo.description && (
              <div className="flex gap-x-2 items-center">
                <Info className="size-5 -ml-0.5" />
                <span>{todo.description}</span>
              </div>
            )}
          </div>
          <div className="flex gap-x-1">
            <Button className="bg-green-500 hover:bg-green-500/80 size-6">
              <Check className="size-4" />
            </Button>
            <Button className="bg-red-500 hover:bg-red-500/80 size-6">
              <X />
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-500/80 size-6">
              <Pen />
            </Button>
          </div>
        </div>
      ))}

      {data.todos.length > 0 && (
        <div className="fixed bottom-12 flex items-center self-center gap-x-8">
          <Button
            onClick={() => goToPage(Math.max(1, page - 1))}
            disabled={page === 1 || isPending}
          >
            <ArrowLeft />
          </Button>
          <span>
            Página {page} de {totalPages || 1}
          </span>
          <Button
            onClick={() => goToPage(Math.min(totalPages || 1, page + 1))}
            disabled={page === (totalPages || 1) || isPending}
          >
            <ArrowRight />
          </Button>
        </div>
      )}
    </>
  );
};
