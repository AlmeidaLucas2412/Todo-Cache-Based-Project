import { UserForm } from "@/components/forms/user-form";

export default function FirstAccess() {
  return (
    <section className="flex flex-col px-6 gap-y-4 py-18">
      <h2 className="font-semibold text-lg">
        Preencha seus dados para começar
      </h2>
      <UserForm />
    </section>
  );
}
