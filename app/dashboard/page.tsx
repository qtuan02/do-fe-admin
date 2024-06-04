import DashboardPage from '@/components/dashboard/DashboardPage';
import NavbarLayout from '@/components/dashboard/layout';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dashboard',
};

export default function Dashboard() {
    return (
        <NavbarLayout>
            <DashboardPage />
        </NavbarLayout>
    );
}
