import { useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice, formatArea, formatDateTime } from "@/utils/generalFormat.ts";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface PropertyListItemProps {
    id: string;
    title: string;
    price: number;
    area: number;
    address: string;
    imageUrl: string;
    createdAt: string;
    approvalStatus?: "NONE" | "PENDING" | "APPROVED" | "REJECTED";
    onApprove?: (id: string) => void;
    onReject?: (id: string) => void;
}

export const PropertyListItem = ({
    id,
    title,
    price,
    area,
    address,
    imageUrl,
    createdAt,
    approvalStatus,
    onApprove,
    onReject,
}: PropertyListItemProps) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleApprove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onApprove?.(id);
    };

    const handleReject = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onReject?.(id);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-3">
            {/* Main Content Wrapper - Link for navigation */}
            <Link
                to={`/bat-dong-san/${id}`}
                className="flex flex-1 gap-4 min-w-0"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image Container - Left side */}
                <div className="relative w-48 h-36 flex-shrink-0 overflow-hidden rounded-lg">
                    <img
                        src={imageUrl}
                        alt={title}
                        className={`w-full h-full object-cover transition-transform duration-300 ${
                            isHovered ? 'scale-110' : 'scale-100'
                        }`}
                    />
                </div>

                {/* Content Container - Right side */}
                <div className="flex flex-col flex-1 min-w-0">
                    {/* Title */}
                    <h3 className="text-gray-900 font-semibold text-lg line-clamp-2 break-words leading-tight mb-2">
                        {title}
                    </h3>

                    {/* Address */}
                    <div className="flex items-start gap-1 text-gray-500 mb-2">
                        <p className="line-clamp-1 text-sm">{address}</p>
                    </div>

                    {/* Area */}
                    <div className="text-gray-600 text-sm mb-2">
                        Diện tích: {formatArea(area)}
                    </div>

                    {/* Price */}
                    <div className="text-[#008DDA] font-bold text-xl mb-auto">
                        {formatPrice(price)}
                    </div>

                    {/* Time - Bottom row */}
                    <div className="flex items-center justify-between mt-2 pt-2">
                        <span className="text-gray-500 text-xs">
                            {formatDateTime(createdAt)}
                        </span>
                    </div>
                </div>
            </Link>

            {/* Approval Buttons - Show only if status is PENDING */}
            {approvalStatus === "PENDING" && (
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

