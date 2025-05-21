import { InsertTodo, TodoStatus } from "@/db/schema";
import { cn } from "@/lib/utils";
import { Check, Info, ListTodo, RotateCcw, X } from "lucide-react";
import { Button } from "./ui/button";
import { useOptimisticStatusTodoMutation } from "@/hooks/useTodoMutation";
import { toast } from "sonner";
import { updateStatus } from "@/actions/todo";

type Props = {
  todo: InsertTodo;
};

export const TodoCard = ({ todo }: Props) => {
  const mutation = useOptimisticStatusTodoMutation();

  const handleStatusUpdate = async (id: string, status: TodoStatus) => {
    try {
      mutation.mutate({ id, status }, {
        onSuccess: () => {
          toast.success("Status da tarefa atualizado com sucesso");
        },
        onError: () => {
          toast.error("Falha ao atualizar status da tarefa");
        }
      });
    } catch (error) {
      console.error("Falha ao atualizar status da tarefa", error);
    }
  };

  return (
    <div
      className={cn(
        "flex justify-between border p-4 items-center",
        todo.status === "done" && "bg-green-700/80",
        todo.status === "excluded" && "bg-red-700/80"
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
        <Button
          className="bg-green-500 hover:bg-green-500/80 size-6"
          onClick={() => handleStatusUpdate(todo.id!, "done")}
        >
          <Check className="size-4" />
        </Button>
        <Button
          className="bg-red-500 hover:bg-red-500/80 size-6"
          onClick={() => handleStatusUpdate(todo.id!, "excluded")}
        >
          <X />
        </Button>
        {todo.status !== "todo" && (
          <Button
            className="bg-blue-500 hover:bg-blue-500/80 size-6"
            onClick={() => handleStatusUpdate(todo.id!, "todo")}
          >
            <RotateCcw />
          </Button>
        )}
      </div>
    </div>
  );
};
