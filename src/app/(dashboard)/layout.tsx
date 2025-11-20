import { Sidebar } from "@/components/layout/Sidebar";
import { TopMenu } from "@/components/layout/TopMenu";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-100 dark:bg-zinc-900">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <TopMenu />
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
