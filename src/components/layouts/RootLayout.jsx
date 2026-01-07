import React from 'react'
import { Outlet } from 'react-router'
import AuthProvider from '../auth/AuthProvider'
import { useTheme } from '@/store/theme.store'

const RootLayout = () => {
    useTheme()
    return (
        <AuthProvider>
            <Outlet />
        </AuthProvider>
    )
}

export default RootLayout