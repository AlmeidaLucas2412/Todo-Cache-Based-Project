"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { saveUser } from "@/actions/user";
import { toast } from "sonner";

export const UserForm = () => {
  const [data, setData] = useState({
    id: "",
    name: "",
    username: "",
    email: "",
    authUserId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();

    const { success, error } = await saveUser(data);

    if (success) {
      setIsLoading(false);
      toast.success("Usuário salvo com sucesso!");
      router.replace("/welcome");
    } else {
      setIsLoading(false);
      toast.error(error);
    }
  };
  return (
    <form
      className="flex flex-col gap-y-4 border rounded-md p-8"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-y-1">
        <label className="font-semibold">Nome</label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          placeholder="John Doe"
          className="border rounded-sm p-2"
        />
      </div>
      <div className="flex flex-col gap-y-1">
        <label className="font-semibold">Username</label>
        <input
          type="text"
          value={data.username}
          onChange={(e) => setData({ ...data, username: e.target.value })}
          placeholder="john_doe"
          className="border rounded-sm p-2"
        />
      </div>
      <div className="flex flex-col gap-y-1">
        <label className="font-semibold">Email</label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          placeholder="JohnDoe@ex.com"
          className="border rounded-sm p-2"
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        <span>{isLoading ? "Salvando..." : "Salvar"}</span>
      </Button>
    </form>
  );
};
