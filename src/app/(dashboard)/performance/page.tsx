import { Metadata } from 'next';
import { PerformanceManagement } from '@/components/features/performance/PerformanceManagement';

export const metadata: Metadata = {
    title: 'Team Performance | Dr.Joy Auto',
    description: 'Track team and individual performance metrics including LOC, bugs, and attendance',
};

export default function PerformancePage() {
    return <PerformanceManagement />;
}
