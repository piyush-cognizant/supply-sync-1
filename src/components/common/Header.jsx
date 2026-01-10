import ThemeSwitcher from './ThemeSwitcher';
import LogoutButton from '@/components/auth/LogoutButton';

export function Header() {
    return (
        <header className="mx-auto mt-6 max-w-6xl rounded-lg border border-white/20 bg-white/10 backdrop-blur-md shadow-lg">
            <div className="flex items-center justify-between h-14 px-4">
                <div className="text-2xl font-bold text-foreground">
                    SupplySync
                </div>
                <div className="flex items-center gap-4">
                    <ThemeSwitcher />
                    <LogoutButton />
                </div>
            </div>
        </header>
    );
}