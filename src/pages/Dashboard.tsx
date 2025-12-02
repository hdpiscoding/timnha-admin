import { useState, useEffect } from "react";
import { UserListItem } from "@/components/user-list-item";
import { PropertyListItem } from "@/components/property-list-item";
import { ControlledPagination } from "@/components/ui/controlled-pagination";
import { Button } from "@/components/ui/button";
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
import { Check, X } from "lucide-react";
import { toast } from "react-toastify";

// Types
interface PendingUser {
    id: string;
    avatarUrl?: string;
    fullName: string;
    email: string;
    phoneNumber: string;
}

interface PendingProperty {
    id: string;
    title: string;
    price: number;
    area: number;
    address: string;
    imageUrl: string;
    createdAt: string;
}

export default function Dashboard() {
    // Pending Users State
    const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
    const [usersCurrentPage, setUsersCurrentPage] = useState(1);
    const [usersTotalPages, setUsersTotalPages] = useState(1);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);

    // Pending Properties State
    const [pendingProperties, setPendingProperties] = useState<PendingProperty[]>([]);
    const [propertiesCurrentPage, setPropertiesCurrentPage] = useState(1);
    const [propertiesTotalPages, setPropertiesTotalPages] = useState(1);
    const [isLoadingProperties, setIsLoadingProperties] = useState(false);

    // Alert Dialog State
    const [alertDialogOpen, setAlertDialogOpen] = useState(false);
    const [alertDialogConfig, setAlertDialogConfig] = useState<{
        title: string;
        description: string;
        onConfirm: () => void;
    } | null>(null);

    // Fetch Pending Users
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const fetchPendingUsers = async (_page: number) => {
        setIsLoadingUsers(true);
        try {
            // TODO: Call API to get pending users
            // const response = await getPendingUsers(_page);

            // Mock data
            const mockUsers: PendingUser[] = [
                {
                    id: "1",
                    fullName: "Nguyễn Văn A",
                    email: "nguyenvana@example.com",
                    phoneNumber: "0901234567",
                },
                {
                    id: "2",
                    avatarUrl: "https://via.placeholder.com/150",
                    fullName: "Trần Thị B",
                    email: "tranthib@example.com",
                    phoneNumber: "0912345678",
                },
                {
                    id: "3",
                    fullName: "Lê Văn C",
                    email: "levanc@example.com",
                    phoneNumber: "0923456789",
                },
            ];

            setPendingUsers(mockUsers);
            setUsersTotalPages(3); // Mock total pages
        } catch (error) {
            console.error("Error fetching pending users:", error);
            toast.error("Không thể tải danh sách người bán chờ duyệt");
        } finally {
            setIsLoadingUsers(false);
        }
    };

    // Fetch Pending Properties
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const fetchPendingProperties = async (_page: number) => {
        setIsLoadingProperties(true);
        try {
            // TODO: Call API to get pending properties
            // const response = await getPendingProperties(_page);

            // Mock data
            const mockProperties: PendingProperty[] = [
                {
                    id: "1",
                    title: "Bán nhà mặt tiền đường Lê Văn Việt, Quận 9",
                    price: 5000000000,
                    area: 80,
                    address: "Đường Lê Văn Việt, Quận 9, TP. Hồ Chí Minh",
                    imageUrl: "https://via.placeholder.com/400x300",
                    createdAt: "2024-01-15T10:30:00Z",
                },
                {
                    id: "2",
                    title: "Cho thuê căn hộ cao cấp Vinhomes Central Park",
                    price: 15000000,
                    area: 70,
                    address: "Vinhomes Central Park, Bình Thạnh, TP. Hồ Chí Minh",
                    imageUrl: "https://via.placeholder.com/400x300",
                    createdAt: "2024-01-14T15:20:00Z",
                },
            ];

            setPendingProperties(mockProperties);
            setPropertiesTotalPages(2); // Mock total pages
        } catch (error) {
            console.error("Error fetching pending properties:", error);
            toast.error("Không thể tải danh sách tin đăng chờ duyệt");
        } finally {
            setIsLoadingProperties(false);
        }
    };

    // Handle Approve/Reject User
    const handleUserApprovalClick = (_userId: string, isApproved: boolean) => {
        setAlertDialogConfig({
            title: isApproved ? "Xác nhận duyệt người bán" : "Xác nhận từ chối",
            description: isApproved
                ? "Bạn có chắc chắn muốn duyệt người bán này không?"
                : "Bạn có chắc chắn muốn từ chối yêu cầu này không?",
            onConfirm: async () => {
                try {
                    // TODO: Call API to approve/reject user
                    // await approveUser(_userId, isApproved);

                    toast.success(
                        isApproved
                            ? "Đã duyệt người bán thành công"
                            : "Đã từ chối yêu cầu"
                    );

                    // Refresh list
                    fetchPendingUsers(usersCurrentPage);
                } catch (error) {
                    console.error("Error approving user:", error);
                    toast.error("Có lỗi xảy ra, vui lòng thử lại");
                }
            },
        });
        setAlertDialogOpen(true);
    };

    // Handle Approve/Reject Property
    const handlePropertyApprovalClick = (_propertyId: string, isApproved: boolean) => {
        setAlertDialogConfig({
            title: isApproved ? "Xác nhận duyệt tin đăng" : "Xác nhận từ chối",
            description: isApproved
                ? "Bạn có chắc chắn muốn duyệt tin đăng này không?"
                : "Bạn có chắc chắn muốn từ chối tin đăng này không?",
            onConfirm: async () => {
                try {
                    // TODO: Call API to approve/reject property
                    // await approveProperty(_propertyId, isApproved);

                    toast.success(
                        isApproved
                            ? "Đã duyệt tin đăng thành công"
                            : "Đã từ chối tin đăng"
                    );

                    // Refresh list
                    fetchPendingProperties(propertiesCurrentPage);
                } catch (error) {
                    console.error("Error approving property:", error);
                    toast.error("Có lỗi xảy ra, vui lòng thử lại");
                }
            },
        });
        setAlertDialogOpen(true);
    };

    // Effects
    useEffect(() => {
        fetchPendingUsers(usersCurrentPage);
    }, [usersCurrentPage]);

    useEffect(() => {
        fetchPendingProperties(propertiesCurrentPage);
    }, [propertiesCurrentPage]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-2">Quản lý yêu cầu duyệt người bán và tin đăng</p>
                </div>

                {/* Pending Users Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-semibold text-gray-900">
                            Yêu cầu duyệt người bán
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Có {pendingUsers.length} yêu cầu đang chờ duyệt
                        </p>
                    </div>

                    <div className="p-6">
                        {isLoadingUsers ? (
                            <div className="text-center py-8 text-gray-500">
                                Đang tải dữ liệu...
                            </div>
                        ) : pendingUsers.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                Không có yêu cầu nào đang chờ duyệt
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pendingUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="flex-1">
                                            <UserListItem {...user} />
                                        </div>
                                        <div className="flex gap-2 flex-shrink-0">
                                            <Button
                                                onClick={() => handleUserApprovalClick(user.id, true)}
                                                className="bg-green-600 hover:bg-green-700 cursor-pointer"
                                                size="sm"
                                            >
                                                <Check className="w-4 h-4 mr-1" />
                                                Duyệt
                                            </Button>
                                            <Button
                                                onClick={() => handleUserApprovalClick(user.id, false)}
                                                className="cursor-pointer hover:bg-red-700"
                                                variant="destructive"
                                                size="sm"
                                            >
                                                <X className="w-4 h-4 mr-1" />
                                                Từ chối
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!isLoadingUsers && pendingUsers.length > 0 && (
                            <div className="mt-6">
                                <ControlledPagination
                                    currentPage={usersCurrentPage}
                                    totalPages={usersTotalPages}
                                    onPageChange={setUsersCurrentPage}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Pending Properties Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-semibold text-gray-900">
                            Yêu cầu duyệt tin đăng
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Có {pendingProperties.length} tin đăng đang chờ duyệt
                        </p>
                    </div>

                    <div className="p-6">
                        {isLoadingProperties ? (
                            <div className="text-center py-8 text-gray-500">
                                Đang tải dữ liệu...
                            </div>
                        ) : pendingProperties.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                Không có tin đăng nào đang chờ duyệt
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pendingProperties.map((property) => (
                                    <div
                                        key={property.id}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="flex-1">
                                            <PropertyListItem {...property} />
                                        </div>
                                        <div className="flex gap-2 flex-shrink-0">
                                            <Button
                                                onClick={() => handlePropertyApprovalClick(property.id, true)}
                                                className="bg-green-600 hover:bg-green-700 cursor-pointer"
                                                size="sm"
                                            >
                                                <Check className="w-4 h-4 mr-1" />
                                                Duyệt
                                            </Button>
                                            <Button
                                                onClick={() => handlePropertyApprovalClick(property.id, false)}
                                                className="cursor-pointer hover:bg-red-700"
                                                variant="destructive"
                                                size="sm"
                                            >
                                                <X className="w-4 h-4 mr-1" />
                                                Từ chối
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!isLoadingProperties && pendingProperties.length > 0 && (
                            <div className="mt-6">
                                <ControlledPagination
                                    currentPage={propertiesCurrentPage}
                                    totalPages={propertiesTotalPages}
                                    onPageChange={setPropertiesCurrentPage}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Alert Dialog */}
            <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{alertDialogConfig?.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {alertDialogConfig?.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer" onClick={() => setAlertDialogOpen(false)}>
                            Hủy
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="cursor-pointer"
                            onClick={() => {
                                alertDialogConfig?.onConfirm();
                                setAlertDialogOpen(false);
                            }}
                        >
                            Xác nhận
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

