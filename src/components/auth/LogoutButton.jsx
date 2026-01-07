import { Button } from '@/components/ui/Button';
import { useAuth } from "../../store/auth.store";
import { toast } from 'sonner';
import { HugeiconsIcon } from '@hugeicons/react';
import { LogOut } from '@hugeicons/core-free-icons/index';

const LogoutButton = ({ iconOnly = true }) => {
    const { clearAuth } = useAuth();
    const handleLogout = () => {
        clearAuth();
        toast.success("Logged out successfully");
    };

    return (
        <Button onClick={handleLogout} variant={iconOnly ? "outline" : "icon"} className="border-destructive text-destructive">
            {iconOnly ? <HugeiconsIcon icon={LogOut} /> : "Logout"}
        </Button>
    );
}

export default LogoutButton;