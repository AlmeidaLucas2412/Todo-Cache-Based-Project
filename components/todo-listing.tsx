"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useTodos } from "@/hooks/useTodoQuery";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Skeleton } from "./ui/skeleton";
import { TodoCard } from "./todo-card";

export const TodoListing = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageParams = searchParams.get("page");
  const page = pageParams ? parseInt(pageParams) : 1;
  const pageSize = 4;
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
        <TodoCard todo={todo} key={todo.id} />
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
