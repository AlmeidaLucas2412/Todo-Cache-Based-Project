"use client";

import { DialogTrigger } from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { AddTodoForm } from "./forms/add-todo-form";
import { useState } from "react";

export const AddTodo = () => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <Dialog open={open} onOpenChange={handleToggle}>
      <DialogTrigger asChild>
        <Button className="flex items-center font-semibold w-fit">
          <span>Adicionar Tarefa</span>
          <Plus className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar uma tarefa</DialogTitle>
        </DialogHeader>
        <AddTodoForm dialog={{ close: handleToggle }} />
      </DialogContent>
    </Dialog>
  );
};
