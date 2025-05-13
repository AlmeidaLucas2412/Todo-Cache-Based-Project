import db from "..";
import { InsertUser, users } from "../schema";

export const upsertUser = async (data: InsertUser) => {
  const [{ id }] = await db
    .insert(users)
    .values(data)
    .onConflictDoUpdate({
      target: users.email,
      set: data,
    })
    .returning({ id: users.id });

  return id;
};
