import { Mail, Phone, User as UserIcon } from "lucide-react";

interface UserListItemProps {
    id: string;
    avatarUrl?: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    onClick?: (id: string) => void;
}

export const UserListItem = ({
                                 id,
                                 avatarUrl,
                                 fullName,
                                 email,
                                 phoneNumber,
                                 onClick,
                             }: UserListItemProps) => {
    const handleClick = () => {
        onClick?.(id);
    };

    return (
        <div
            onClick={handleClick}
            className={`flex cursor-pointer gap-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4 border border-gray-200 ${
                onClick ? 'cursor-pointer' : ''
            }`}
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

                {/* Email */}
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{email}</span>
                </div>

                {/* Phone Number */}
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{phoneNumber}</span>
                </div>
            </div>
        </div>
    );
};

