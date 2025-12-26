import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Home,
    FileText,
    Users,
    Settings,
    LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-toastify';
import {useUserStore} from "@/stores/userStore.ts";
import logo from "@/assets/timnha-portrait.png";

interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    path: string;
    isActive: boolean;
    isDanger?: boolean;
    onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
                                                     icon,
                                                     label,
                                                     path,
                                                     isActive,
                                                     isDanger = false,
                                                     onClick
                                                 }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            navigate(path);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={cn(
                "w-full flex items-center cursor-pointer gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                "hover:bg-gray-100 active:scale-[0.98]",
                isActive && !isDanger && "bg-[#008DDA]/10 text-[#008DDA] font-medium shadow-sm",
                isDanger && "text-red-600 hover:bg-red-600 hover:text-white",
                !isActive && !isDanger && "text-gray-700 hover:text-gray-900"
            )}
        >
            <span className={cn(
                "flex-shrink-0 transition-transform duration-200",
                isActive && !isDanger && "text-[#008DDA]",
                isDanger && "group-hover:text-white"
            )}>
                {icon}
            </span>
            <span className="text-left text-[15px]">{label}</span>
        </button>
    );
};

// Bottom Nav Item Component for mobile
const BottomNavItem: React.FC<SidebarItemProps> = ({
                                                       icon,
                                                       label,
                                                       path,
                                                       isActive,
                                                       onClick
                                                   }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            navigate(path);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={cn(
                "flex flex-col items-center justify-center transition-all duration-200 cursor-pointer",
                "flex-1 py-2 px-1",
                isActive && "text-[#008DDA]",
                !isActive && "text-gray-600 hover:text-gray-900"
            )}
        >
            <span className="transition-transform duration-200">
                {icon}
            </span>
            <span className="text-[10px] mt-1 font-medium">
                {label}
            </span>
        </button>
    );
};

export const AdminSidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const logout = useUserStore((state) => state.logout);

    const handleLogout = () => {
        // TODO: Clear admin auth state
        logout();
        navigate('/dang-nhap');
        toast.success("Đăng xuất thành công!");
        console.log('Admin logging out...');
    };

    const menuItems = [
        {
            icon: <Home size={20} />,
            label: 'Trang chủ',
            path: '/bang-dieu-khien',
        },
        {
            icon: <FileText size={20} />,
            label: 'Quản lý tin đăng',
            path: '/tin-dang',
        },
        {
            icon: <Users size={20} />,
            label: 'Quản lý người dùng',
            path: '/nguoi-dung',
        },
        {
            icon: <Settings size={20} />,
            label: 'Quản lý bộ ưu tiên',
            path: '/bo-uu-tien',
        },
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden sm:flex w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex-col shadow-sm">
                {/* Logo */}
                <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-white to-gray-50">
                    <button
                        onClick={() => navigate('/bang-dieu-khien')}
                        className="flex flex-col items-center justify-center w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#008DDA] focus:ring-offset-2 rounded-lg p-2 cursor-pointer"
                    >
                        <img
                            src={logo}
                            alt="TimNha Admin"
                            className="h-16 w-auto drop-shadow-sm"
                        />
                        <span className="text-xs font-semibold text-gray-600 mt-2 uppercase tracking-wide">
                            Trang quản trị viên
                        </span>
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {menuItems.map((item) => (
                        <SidebarItem
                            key={item.path}
                            icon={item.icon}
                            label={item.label}
                            path={item.path}
                            isActive={location.pathname === item.path}
                        />
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-gray-200 bg-gradient-to-br from-white to-gray-50">
                    <SidebarItem
                        icon={<LogOut size={20} />}
                        label="Đăng xuất"
                        path=""
                        isActive={false}
                        isDanger={true}
                        onClick={handleLogout}
                    />
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
                <div className="flex items-center justify-around px-2 pb-safe">
                    {menuItems.map((item) => (
                        <BottomNavItem
                            key={item.path}
                            icon={item.icon}
                            label={item.label}
                            path={item.path}
                            isActive={location.pathname === item.path}
                        />
                    ))}
                </div>
            </nav>
        </>
    );
};

