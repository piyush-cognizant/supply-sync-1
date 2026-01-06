import React from 'react'
import { Outlet } from 'react-router'
import AuthProvider from '../auth/AuthProvider'

const RootLayout = () => {
    return (
        <AuthProvider>
            <Outlet />
        </AuthProvider>
    )
}

export default RootLayout