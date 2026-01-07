import React from 'react'
import { Outlet, Navigate } from 'react-router'
import { useAuth } from '@/store/auth.store'
import LogoutButton from '@/components/auth/LogoutButton';
import { USER_ROLES } from '@/constants/entities';

const VendorLayout = () => {
    const { getUser } = useAuth();
    const user = getUser();

    if (user === undefined) return null; // Wait for hydration

    if (!user || user?.role !== USER_ROLES.VENDOR) {
        return <Navigate to="/unauthorized" replace />;
    }

    return (
        <div>
            Hi, Vendor Layout <LogoutButton />
            <Outlet />
        </div>
    )
}

export default VendorLayout