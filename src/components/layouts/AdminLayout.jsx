import React from 'react'
import { Outlet } from 'react-router'

const AdminLayout = () => {
    return (
        <div>
            Hi, Admin Layout
            <Outlet />
        </div>
    )
}

export default AdminLayout