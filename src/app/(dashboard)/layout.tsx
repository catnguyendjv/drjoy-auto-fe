import { Sidebar } from "@/components/layout/Sidebar";
import { TopMenu } from "@/components/layout/TopMenu";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-background text-foreground">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <TopMenu />
                <main className="flex-1 overflow-y-auto p-8 bg-content2/40">
                    {children}
                </main>
            </div>
        </div>
    );
}
