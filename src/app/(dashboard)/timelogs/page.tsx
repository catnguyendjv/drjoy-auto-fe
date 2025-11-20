import { Metadata } from 'next';
import { TimeLogManagement } from '@/components/features/timelogs/TimeLogManagement';

export const metadata: Metadata = {
    title: 'Time Logs | Dr.Joy Auto',
    description: 'Manage and analyze time logs from Redmine activities',
};

export default function TimeLogsPage() {
    return <TimeLogManagement />;
}
