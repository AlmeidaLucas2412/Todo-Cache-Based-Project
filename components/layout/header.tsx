import { ThemeToggle } from "../theme-toggle";

export const Header = () => {
  return (
    <header className="fixed flex justify-between w-full left-0 top-0 items-center p-6">
      <h1 className="font-semibold text-xl">
        Todo<span className="text-green-400">APP</span>
      </h1>
      <ThemeToggle />
    </header>
  );
};
