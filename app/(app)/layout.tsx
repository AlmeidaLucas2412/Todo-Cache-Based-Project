import { Header } from "@/components/layout/header";

type Props = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: Props) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col pt-20">{children}</main>
    </div>
  );
};

export default MainLayout;
