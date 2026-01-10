import React from 'react'
import { Outlet, Navigate } from 'react-router'
import { useAuth } from '@/store/auth.store'
import { USER_ROLES } from '@/constants/entities';
import { Header } from '../common/Header';

const AdminLayout = () => {
    const { getUser } = useAuth();
    const user = getUser();

    if (user === undefined) return null; // Wait for hydration

    if (!user || user?.role !== USER_ROLES.ADMIN) {
        return <Navigate to="/unauthorized" replace />;
    }

    return (
        <div className='px-4'>  
            <Header />
            <main className='mx-auto mt-6 max-w-6xl'>
                <Outlet />
            </main>
        </div>
    )
}

export default AdminLayout