import { InsertTodo } from "@/db/schema";
import { useState } from "react";
import { Button } from "../ui/button";
import { saveTodo } from "@/actions/todo";
import { toast } from "sonner";
import { useOptimisticTodoMutation } from "@/hooks/useTodoMutation";

type TodoFormData = Pick<InsertTodo, "title" | "description">;

type Props = {
  dialog: {
    close: () => void;
  };
};

export const AddTodoForm = ({ dialog }: Props) => {
  const [data, setData] = useState<TodoFormData>({
    title: "",
    description: "",
  });

  const mutation = useOptimisticTodoMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.title) return;

    try {
      mutation.mutate({ data });

      const result = await saveTodo(data);

      if (result.success) {
        setData({ title: "", description: "" });
        toast.success("Tarefa salva com sucesso!");
        dialog.close();
      } else {
        console.error("Falha ao adicionar tarefa", result.error);
        toast.error("Falha ao adicionar tarefa");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-2">
        <label>Tarefa</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
          className="p-2 border border-foreground rounded-md"
          placeholder="Estudar React"
        />
      </div>
      <div className="flex flex-col gap-y-2">
        <label>Descrição (opcional)</label>
        <input
          type="text"
          value={data.description || ""}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          className="p-2 border border-foreground rounded-md"
          placeholder="Estudar React com Typescript 3 horas por dia"
        />
      </div>
      <Button type="submit">Salvar Tarefa</Button>
    </form>
  );
};
