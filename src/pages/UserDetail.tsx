import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Shield,
    Heart,
    GraduationCap,
    ShoppingBag,
    Car,
    Leaf,
    Music,
    User as UserIcon,
    Phone,
    MapPin,
    Calendar,
    ArrowLeft,
    Check,
    X,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import type { User } from "@/types/user";
import {formatDateTime} from "@/utils/generalFormat.ts";
import { getUserById, approveSellerRequest } from "@/services/userServices";

const preferenceConfig = [
    {
        key: 'preferenceSafety' as keyof User,
        label: 'An ninh',
        icon: Shield,
        color: 'bg-blue-100 text-blue-600',
        barColor: 'bg-blue-500'
    },
    {
        key: 'preferenceHealthcare' as keyof User,
        label: 'Y tế',
        icon: Heart,
        color: 'bg-red-100 text-red-600',
        barColor: 'bg-red-500'
    },
    {
        key: 'preferenceEducation' as keyof User,
        label: 'Giáo dục',
        icon: GraduationCap,
        color: 'bg-purple-100 text-purple-600',
        barColor: 'bg-purple-500'
    },
    {
        key: 'preferenceShopping' as keyof User,
        label: 'Tiện ích',
        icon: ShoppingBag,
        color: 'bg-green-100 text-green-600',
        barColor: 'bg-green-500'
    },
    {
        key: 'preferenceTransportation' as keyof User,
        label: 'Giao thông',
        icon: Car,
        color: 'bg-yellow-100 text-yellow-600',
        barColor: 'bg-yellow-500'
    },
    {
        key: 'preferenceEnvironment' as keyof User,
        label: 'Môi trường',
        icon: Leaf,
        color: 'bg-teal-100 text-teal-600',
        barColor: 'bg-teal-500'
    },
    {
        key: 'preferenceEntertainment' as keyof User,
        label: 'Giải trí',
        icon: Music,
        color: 'bg-pink-100 text-pink-600',
        barColor: 'bg-pink-500'
    },
];

export default function UserDetail() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

    // Fetch user data
    useEffect(() => {
        const fetchUser = async () => {
            if (!id) {
                toast.error("ID người dùng không hợp lệ");
                navigate("/nguoi-dung");
                return;
            }

            setIsLoading(true);
            try {
                const response = await getUserById(Number(id));

                // Map API response với giá trị mặc định cho null values
                const mappedUser: User = {
                    id: response.data.id,
                    fullName: response.data.fullName || "Chưa cập nhật",
                    phoneNumber: response.data.phoneNumber || "Chưa cập nhật",
                    avatarUrl: response.data.avatarUrl || null,
                    liveAddress: response.data.liveAddress || "Chưa cập nhật",
                    preferenceType: response.data.preferenceType || null,
                    updateAt: response.data.updateAt,
                    becomeSellerApproveStatus: response.data.becomeSellerApproveStatus || "NONE",
                    preferenceSafety: response.data.preferenceSafety ?? 0,
                    preferenceHealthcare: response.data.preferenceHealthcare ?? 0,
                    preferenceEducation: response.data.preferenceEducation ?? 0,
                    preferenceShopping: response.data.preferenceShopping ?? 0,
                    preferenceTransportation: response.data.preferenceTransportation ?? 0,
                    preferenceEnvironment: response.data.preferenceEnvironment ?? 0,
                    preferenceEntertainment: response.data.preferenceEntertainment ?? 0,
                };

                setUser(mappedUser);
            } catch (error) {
                console.error("Error fetching user:", error);
                toast.error("Không thể tải thông tin người dùng");
                navigate("/nguoi-dung");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [id, navigate]);

    // Handle Approve
    const handleApprove = () => {
        setApproveDialogOpen(true);
    };

    const handleApproveConfirm = async () => {
        if (!id) return;

        try {
            await approveSellerRequest("APPROVED", "", Number(id));

            toast.success("Đã duyệt yêu cầu thành công");
            setApproveDialogOpen(false);
            navigate("/nguoi-dung");
        } catch (error) {
            console.error("Error approving seller request:", error);
            toast.error("Có lỗi xảy ra khi duyệt yêu cầu");
        }
    };

    // Handle Reject
    const handleReject = () => {
        setRejectDialogOpen(true);
    };

    const handleRejectConfirm = async () => {
        if (!id) return;

        try {
            await approveSellerRequest("REJECTED", "", Number(id));

            toast.success("Đã từ chối yêu cầu");
            setRejectDialogOpen(false);
            navigate("/nguoi-dung");
        } catch (error) {
            console.error("Error rejecting seller request:", error);
            toast.error("Có lỗi xảy ra khi từ chối yêu cầu");
        }
    };

    // Get status badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING":
                return <Badge className="bg-yellow-500 hover:bg-yellow-600">Chờ duyệt</Badge>;
            case "APPROVED":
                return <Badge className="bg-green-500 hover:bg-green-600">Đã duyệt</Badge>;
            case "REJECTED":
                return <Badge className="bg-red-500 hover:bg-red-600">Đã từ chối</Badge>;
            case "NONE":
                return <Badge variant="secondary">Chưa đăng ký</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    // if (!user) {
    //     return (
    //         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    //             <div className="text-center">
    //                 <p className="text-gray-600">Không tìm thấy thông tin người dùng</p>
    //                 <Button
    //                     onClick={() => navigate("/nguoi-dung")}
    //                     className="mt-4 bg-[#008DDA] hover:bg-[#0077b6] cursor-pointer"
    //                 >
    //                     Quay lại
    //                 </Button>
    //             </div>
    //         </div>
    //     );
    // }

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-[#008DDA] animate-spin" />
                    <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Back Button */}
                <Button
                    onClick={() => navigate("/nguoi-dung")}
                    variant="outline"
                    className="mb-4 cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại
                </Button>

                {/* Header Card - Avatar and Basic Info */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">
                        Thông tin người dùng
                    </h1>

                    <div className="flex flex-col md:flex-row items-start gap-6">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            {user?.avatarUrl ? (
                                <img
                                    src={user?.avatarUrl}
                                    alt={user?.fullName}
                                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                                    <UserIcon className="w-16 h-16 text-gray-500" />
                                </div>
                            )}
                        </div>

                        {/* Basic Info */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {user?.fullName}
                                </h2>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Phone className="w-5 h-5 text-gray-500" />
                                    <span className="font-medium">Số điện thoại:</span>
                                    <span>{user?.phoneNumber}</span>
                                </div>

                                {user?.liveAddress && (
                                    <div className="flex items-start gap-2 text-gray-700">
                                        <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-medium">Địa chỉ:</span>
                                            <span className="ml-2">{user?.liveAddress}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 text-gray-700">
                                    <Calendar className="w-5 h-5 text-gray-500" />
                                    <span className="font-medium">Cập nhật lần cuối:</span>
                                    <span>{formatDateTime(String(user?.updateAt))}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Seller Status Card */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Trạng thái người bán
                    </h2>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-gray-700 font-medium">Trạng thái:</span>
                            {getStatusBadge(String(user?.becomeSellerApproveStatus))}
                        </div>

                        {/* Approve/Reject Buttons - Show only if PENDING */}
                        {user?.becomeSellerApproveStatus === "PENDING" && (
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleApprove}
                                    className="bg-green-600 hover:bg-green-700 cursor-pointer"
                                >
                                    <Check className="w-4 h-4 mr-2" />
                                    Duyệt
                                </Button>
                                <Button
                                    onClick={handleReject}
                                    variant="destructive"
                                    className="cursor-pointer hover:bg-red-700"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Từ chối
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Preference Type Card */}
                {user?.preferenceType && (
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Loại ưu tiên
                        </h2>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-base py-2 px-4">
                                {user?.preferenceType}
                            </Badge>
                        </div>
                    </div>
                )}

                {/* Preferences Card */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                        Chi tiết ưu tiên
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {preferenceConfig.map((config) => {
                            const value = user[config.key] as number | null;
                            const Icon = config.icon;
                            const percentage = value !== null ? Math.round(value * 100) : 0;

                            return (
                                <div key={config.key} className="space-y-3">
                                    {/* Label and Icon */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={cn("w-8 h-8 rounded-md flex items-center justify-center", config.color)}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium text-gray-900">
                                                {config.label}
                                            </span>
                                        </div>
                                        <span className="text-lg font-bold text-gray-900">
                                            {value !== null ? `${percentage}%` : 'N/A'}
                                        </span>
                                    </div>

                                    {/* Progress Bar */}
                                    {value !== null && (
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className={cn("h-2.5 rounded-full transition-all duration-300", config.barColor)}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Approve Dialog */}
            <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận duyệt</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn duyệt yêu cầu trở thành người bán của{" "}
                            <span className="font-semibold">{user?.fullName}</span>?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleApproveConfirm}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Xác nhận
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Reject Dialog */}
            <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận từ chối</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn từ chối yêu cầu trở thành người bán của{" "}
                            <span className="font-semibold">{user?.fullName}</span>?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleRejectConfirm}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Xác nhận
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

