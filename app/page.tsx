import MainClient from "@/components/main/MainClient";
import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/main/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1">
          <MainClient />
        </main>
      </div>
    </div>
  );
}
