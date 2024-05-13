'use client'
import DashboardPage from '@/components/dashboard/DashboardPage';
import NavbarLayout from '@/components/dashboard/layout';

export default function Dashboard() {
    return (
        <NavbarLayout>
            <DashboardPage />
        </NavbarLayout>
    );
}
