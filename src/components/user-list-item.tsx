import { Phone, User as UserIcon, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserListItemProps {
    id: string;
    avatarUrl?: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    becomeSellerApproveStatus?: "NONE" | "PENDING" | "APPROVED" | "REJECTED";
    onClick?: (id: string) => void;
    onApprove?: (id: string) => void;
    onReject?: (id: string) => void;
}

export const UserListItem = ({
    id,
    avatarUrl,
    fullName,
    phoneNumber,
    becomeSellerApproveStatus,
    onClick,
    onApprove,
    onReject,
}: UserListItemProps) => {
    const handleClick = () => {
        onClick?.(id);
    };

    const handleApprove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onApprove?.(id);
    };

    const handleReject = (e: React.MouseEvent) => {
        e.stopPropagation();
        onReject?.(id);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4 border border-gray-200">
            {/* Main Content Wrapper */}
            <div
                onClick={handleClick}
                className={`flex flex-1 gap-4 min-w-0 ${onClick ? 'cursor-pointer' : ''}`}
            >
                {/* Avatar - Left side */}
                <div className="flex-shrink-0">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={fullName}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                            <UserIcon className="w-8 h-8 text-gray-500" />
                        </div>
                    )}
                </div>

                {/* Content - Right side */}
                <div className="flex flex-col flex-1 min-w-0 justify-center gap-1">
                    {/* Full Name */}
                    <h3 className="text-gray-900 font-semibold text-lg">
                        {fullName}
                    </h3>

                    {/* Phone Number */}
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span>{phoneNumber}</span>
                    </div>
                </div>
            </div>

            {/* Approval Buttons - Show only if status is PENDING */}
            {becomeSellerApproveStatus === "PENDING" && (
                <div className="flex gap-2 flex-shrink-0 lg:items-center lg:justify-center">
                    <Button
                        onClick={handleApprove}
                        className="flex-1 lg:flex-none bg-green-600 hover:bg-green-700 cursor-pointer"
                        size="sm"
                    >
                        <Check className="w-4 h-4 mr-1" />
                        Duyệt
                    </Button>
                    <Button
                        onClick={handleReject}
                        className="flex-1 lg:flex-none cursor-pointer hover:bg-red-700"
                        variant="destructive"
                        size="sm"
                    >
                        <X className="w-4 h-4 mr-1" />
                        Từ chối
                    </Button>
                </div>
            )}
        </div>
    );
};

