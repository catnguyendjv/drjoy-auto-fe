import { Metadata } from "next";
import { IssueManagement } from "@/components/features/tickets/IssueManagement";

export const metadata: Metadata = {
    title: "Issue Management | Dr.Joy Auto",
    description: "Quản lý issues Redmine, tạo ticket con và cập nhật đồng loạt.",
};

export default function IssueManagementPage() {
    return <IssueManagement />;
}
