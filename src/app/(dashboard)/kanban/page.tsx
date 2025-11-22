import { BreadcrumbItem, Breadcrumbs, Card, CardBody, CardHeader } from "@heroui/react";
import { KanbanBoard } from "@/components/features/kanban/KanbanBoard";

export default function KanbanPage() {
    return (
        <Card shadow="sm" className="border-1 border-default-100">
            <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                    <p className="text-sm text-default-500">Projects</p>
                    <h1 className="text-2xl font-semibold">Kanban Board</h1>
                </div>
                <Breadcrumbs variant="solid" size="sm">
                    <BreadcrumbItem href="/">Home</BreadcrumbItem>
                    <BreadcrumbItem href="/kanban">Kanban</BreadcrumbItem>
                </Breadcrumbs>
            </CardHeader>
            <CardBody className="bg-content2/40">
                <KanbanBoard />
            </CardBody>
        </Card>
    );
}
