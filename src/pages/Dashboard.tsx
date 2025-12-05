import { useState, useEffect } from "react";
import { UserListItem } from "@/components/user-list-item";
import { PropertyListItem } from "@/components/property-list-item";
import { ControlledPagination } from "@/components/ui/controlled-pagination";
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
import { toast } from "react-toastify";
import { searchUsers, approveSellerRequest } from "@/services/userServices";
import { searchProperties, approveListingRequest } from "@/services/propertyServices";
import type { PropertyListing } from "@/types/property-listing";
import { Skeleton } from "@/components/ui/skeleton";
import { RejectReasonDialog } from "@/components/reject-reason-dialog";
import { Loader2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

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
    // Initial Loading State (for first page load)
    const [isInitialLoading, setIsInitialLoading] = useState(true);

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
    const [alertDialogLoading, setAlertDialogLoading] = useState(false);
    const [alertDialogConfig, setAlertDialogConfig] = useState<{
        title: string;
        description: string;
        onConfirm: () => Promise<void>;
    } | null>(null);

    // Reject Reason Dialog State (for user rejection)
    const [rejectReasonDialogOpen, setRejectReasonDialogOpen] = useState(false);
    const [pendingUserIdForReject, setPendingUserIdForReject] = useState<string | null>(null);

    // Fetch Pending Users
    const fetchPendingUsers = async (page: number) => {
        setIsLoadingUsers(true);
        try {
            // Call API to get pending users
            const response = await searchUsers({
                filters: [
                    {
                        key: "becomeSellerApproveStatus",
                        operator: "equal",
                        value: "PENDING"
                    }
                ],
                sorts: [
                    {
                        key: "createAt",
                        type: "DESC"
                    }
                ],
                rpp: 5,
                page: page
            });

            setPendingUsers(response.data.items);
            setUsersTotalPages(response.data.pages || 1);
        } catch (error) {
            console.error("Error fetching pending users:", error);
            toast.error("Không thể tải danh sách người bán chờ duyệt");
        } finally {
            setIsLoadingUsers(false);
        }
    };

    // Fetch Pending Properties
    const fetchPendingProperties = async (page: number) => {
        setIsLoadingProperties(true);
        try {
            // Call API to get pending properties
            const response = await searchProperties({
                filters: [
                    {
                        key: "approvalStatus",
                        operator: "equal",
                        value: "PENDING"
                    }
                ],
                sorts: [
                    {
                        key: "createdAt",
                        type: "DESC"
                    }
                ],
                rpp: 5,
                page: page
            });

            // Map PropertyListing to PendingProperty format
            const mappedProperties: PendingProperty[] = response.data.items.map((listing: PropertyListing) => {
                // Build full address
                const addressParts = [
                    listing.addressStreet,
                    listing.addressWard,
                    listing.addressDistrict,
                    listing.addressCity,
                ].filter(Boolean);
                const fullAddress = addressParts.join(", ");

                return {
                    id: listing.id.toString(),
                    title: listing.title,
                    price: listing.price,
                    area: listing.area,
                    address: fullAddress,
                    imageUrl: listing.imageUrls.length > 0 ? listing.imageUrls[0] : "https://via.placeholder.com/400x300",
                    createdAt: listing.createdAt,
                };
            });

            setPendingProperties(mappedProperties);
            setPropertiesTotalPages(response.data.pages || 1);
        } catch (error) {
            console.error("Error fetching pending properties:", error);
            toast.error("Không thể tải danh sách tin đăng chờ duyệt");
        } finally {
            setIsLoadingProperties(false);
        }
    };

    // Handle Approve/Reject User
    const handleUserApprovalClick = (userId: string, isApproved: boolean) => {
        if (isApproved) {
            // For approval, show simple confirm dialog
            setAlertDialogConfig({
                title: "Xác nhận duyệt người bán",
                description: "Bạn có chắc chắn muốn duyệt người bán này không?",
                onConfirm: async () => {
                    try {
                        await approveSellerRequest("APPROVED", "", parseInt(userId));
                        toast.success("Đã duyệt người bán thành công");
                        fetchPendingUsers(usersCurrentPage);
                    } catch (error) {
                        console.error("Error approving user:", error);
                        toast.error("Có lỗi xảy ra, vui lòng thử lại");
                    }
                },
            });
            setAlertDialogOpen(true);
        } else {
            // For rejection, show reject reason dialog
            setPendingUserIdForReject(userId);
            setRejectReasonDialogOpen(true);
        }
    };

    // Handle User Rejection with Reason
    const handleUserReject = async (reason: string) => {
        if (!pendingUserIdForReject) return;

        try {
            await approveSellerRequest("REJECTED", reason, parseInt(pendingUserIdForReject));
            toast.success("Đã từ chối yêu cầu");
            fetchPendingUsers(usersCurrentPage);
        } catch (error) {
            console.error("Error rejecting user:", error);
            toast.error("Có lỗi xảy ra, vui lòng thử lại");
        } finally {
            setPendingUserIdForReject(null);
        }
    };

    // Handle Approve/Reject Property
    const handlePropertyApprovalClick = (propertyId: string, isApproved: boolean) => {
        setAlertDialogConfig({
            title: isApproved ? "Xác nhận duyệt tin đăng" : "Xác nhận từ chối",
            description: isApproved
                ? "Bạn có chắc chắn muốn duyệt tin đăng này không?"
                : "Bạn có chắc chắn muốn từ chối tin đăng này không?",
            onConfirm: async () => {
                try {
                    // Call API to approve/reject property
                    const status = isApproved ? "APPROVED" : "REJECTED";
                    await approveListingRequest(status, parseInt(propertyId));

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

    // Turn off initial loading when both sections have loaded
    useEffect(() => {
        if (!isLoadingUsers && !isLoadingProperties && isInitialLoading) {
            setIsInitialLoading(false);
        }
    }, [isLoadingUsers, isLoadingProperties, isInitialLoading]);

    return (
        <div className="min-h-screen bg-gray-50 p-6 relative">
            {/* Initial Loading Overlay */}
            {isInitialLoading && (
                <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Spinner className="w-12 h-12 text-[#008DDA]" />
                        <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
                    </div>
                </div>
            )}

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
                            <div className="space-y-4">
                                {/* Show 3 skeleton items while loading */}
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                                        {/* Avatar skeleton */}
                                        <Skeleton className="w-16 h-16 rounded-full flex-shrink-0" />

                                        {/* Content skeleton */}
                                        <div className="flex-1 space-y-2">
                                            {/* Name */}
                                            <Skeleton className="h-5 w-48" />

                                            {/* Phone */}
                                            <Skeleton className="h-4 w-40" />
                                        </div>

                                        {/* Action buttons skeleton */}
                                        <div className="flex gap-2 flex-shrink-0">
                                            <Skeleton className="w-20 h-8 rounded-md" />
                                            <Skeleton className="w-20 h-8 rounded-md" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : pendingUsers.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                Không có yêu cầu nào đang chờ duyệt
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pendingUsers.map((user) => (
                                    <UserListItem
                                        key={user.id}
                                        {...user}
                                        becomeSellerApproveStatus = "PENDING"
                                        onApprove={(id) => handleUserApprovalClick(id, true)}
                                        onReject={(id) => handleUserApprovalClick(id, false)}
                                    />
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
                            <div className="space-y-4">
                                {/* Show 3 skeleton items while loading */}
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex gap-4 p-3 border border-gray-200 rounded-lg">
                                        {/* Image skeleton */}
                                        <Skeleton className="w-48 h-36 rounded-lg flex-shrink-0" />

                                        {/* Content skeleton */}
                                        <div className="flex-1 space-y-3">
                                            {/* Title */}
                                            <Skeleton className="h-6 w-3/4" />

                                            {/* Address */}
                                            <Skeleton className="h-4 w-2/3" />

                                            {/* Area */}
                                            <Skeleton className="h-4 w-32" />

                                            {/* Price */}
                                            <Skeleton className="h-6 w-40" />

                                            {/* Date */}
                                            <Skeleton className="h-3 w-36" />
                                        </div>

                                        {/* Action buttons skeleton */}
                                        <div className="flex gap-2 flex-shrink-0 items-center">
                                            <Skeleton className="w-20 h-8 rounded-md" />
                                            <Skeleton className="w-20 h-8 rounded-md" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : pendingProperties.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                Không có tin đăng nào đang chờ duyệt
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pendingProperties.map((property) => (
                                    <PropertyListItem
                                        key={property.id}
                                        {...property}
                                        approvalStatus="PENDING"
                                        onApprove={(id) => handlePropertyApprovalClick(id, true)}
                                        onReject={(id) => handlePropertyApprovalClick(id, false)}
                                    />
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
                        <AlertDialogCancel
                            className="cursor-pointer"
                            onClick={() => setAlertDialogOpen(false)}
                            disabled={alertDialogLoading}
                        >
                            Hủy
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="cursor-pointer"
                            disabled={alertDialogLoading}
                            onClick={async () => {
                                if (!alertDialogConfig?.onConfirm) return;
                                setAlertDialogLoading(true);
                                try {
                                    await alertDialogConfig.onConfirm();
                                    setAlertDialogOpen(false);
                                } finally {
                                    setAlertDialogLoading(false);
                                }
                            }}
                        >
                            {alertDialogLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {alertDialogLoading ? "Đang xử lý..." : "Xác nhận"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Reject Reason Dialog for Users */}
            <RejectReasonDialog
                open={rejectReasonDialogOpen}
                onOpenChange={setRejectReasonDialogOpen}
                onConfirm={handleUserReject}
                title="Xác nhận từ chối người bán"
                description="Vui lòng nhập lý do từ chối (không bắt buộc)"
            />
        </div>
    );
}

