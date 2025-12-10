import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserListItem } from "@/components/user-list-item";
import { ControlledPagination } from "@/components/ui/controlled-pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import { UserFilterDialog, type FilterValues } from "@/components/user-filter-dialog";
import { RejectReasonDialog } from "@/components/reject-reason-dialog";
import { Filter } from "lucide-react";
import { toast } from "react-toastify";
import { useSearchQuery } from "@/hooks/use-search-query";
import { searchUsers, approveSellerRequest } from "@/services/userServices";
import { Skeleton } from "@/components/ui/skeleton";

// Types
interface User {
    id: string;
    avatarUrl?: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    createdAt?: string;
}

type SortOption = "newest" | "oldest" | "name-asc" | "name-desc";

export default function UserManagement() {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [totalUsers, setTotalUsers] = useState(0);
    const [sortBy, setSortBy] = useState<SortOption>("newest");

    // Use search query hook for URL sync
    const { filters, sorts, page, setMultipleFilters, setSingleSort, setPage } = useSearchQuery();

    // Filter Dialog State
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);

    // Alert Dialog State for Approve
    const [alertDialogOpen, setAlertDialogOpen] = useState(false);
    const [alertDialogLoading, setAlertDialogLoading] = useState(false);
    const [alertDialogConfig, setAlertDialogConfig] = useState<{
        title: string;
        description: string;
        userName: string;
        onConfirm: () => Promise<void>;
    } | null>(null);

    // Reject Reason Dialog State
    const [rejectReasonDialogOpen, setRejectReasonDialogOpen] = useState(false);
    const [pendingUserIdForReject, setPendingUserIdForReject] = useState<string | null>(null);
    const [pendingUserNameForReject, setPendingUserNameForReject] = useState<string>("");

    // Build initial filters from URL filters for dialog
    const getInitialFiltersForDialog = (): FilterValues => {
        // Find filters from URL - hook returns raw values
        const fullNameFilter = filters.find(f => f.key === 'fullName' && f.operator === 'lk');
        const phoneNumberFilter = filters.find(f => f.key === 'phoneNumber' && f.operator === 'eq');
        const becomeSellerApproveStatusFilter = filters.find(f => f.key === 'becomeSellerApproveStatus' && f.operator === 'eq');

        return {
            fullName: fullNameFilter ? fullNameFilter.value : null,
            phoneNumber: phoneNumberFilter ? phoneNumberFilter.value : null,
            becomeSellerApproveStatus: becomeSellerApproveStatusFilter
                ? { id: becomeSellerApproveStatusFilter.value, name: becomeSellerApproveStatusFilter.value }
                : null,
        };
    };

    // Fetch Users
    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            // Convert filters from URL to API format
            const apiFilters = filters.map(filter => ({
                key: filter.key,
                operator: filter.operator === 'eq' ? 'equal' :
                          filter.operator === 'gt' ? 'greater' :
                          filter.operator === 'lt' ? 'less' :
                          filter.operator === 'gte' ? 'greater_equal' :
                          filter.operator === 'lte' ? 'less_equal' :
                          filter.operator === 'lk' ? 'like' :
                          filter.operator === 'rng' ? 'range' : 'equal',
                value: filter.value
            }));

            // Build API sorts from URL sorts
            const apiSorts = sorts.map(sort => ({
                key: sort.key,
                type: sort.type
            }));

            // Call API to get users with page from URL
            const response = await searchUsers({
                filters: apiFilters,
                sorts: apiSorts,
                rpp: 2,
                page: page,
            });

            setUsers(response.data.items);
            setTotalUsers(response.data.records || 0);
            setTotalPages(response.data.pages || 1);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Không thể tải danh sách người dùng");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Sort Change
    const handleSortChange = (value: SortOption) => {
        setSortBy(value);

        // Use setSingleSort from hook to clear all sorts and set new one atomically (with page reset)
        switch (value) {
            case "newest":
                setSingleSort("createAt", "DESC", true);
                break;
            case "oldest":
                setSingleSort("createAt", "ASC", true);
                break;
            case "name-asc":
                setSingleSort("fullName", "ASC", true);
                break;
            case "name-desc":
                setSingleSort("fullName", "DESC", true);
                break;
        }
    };

    // Count active filters
    const getActiveFiltersCount = () => {
        return filters.length;
    };

    // Handle Filter Click
    const handleFilterClick = () => {
        setFilterDialogOpen(true);
    };

    // Handle Apply Filter
    const handleApplyFilter = (newFilters: FilterValues) => {
        // Update URL with new filters
        setMultipleFilters([
            { key: "fullName", operator: "lk", value: newFilters.fullName || "" },
            { key: "phoneNumber", operator: "lk", value: newFilters.phoneNumber || "" },
            { key: "becomeSellerApproveStatus", operator: "eq", value: newFilters.becomeSellerApproveStatus?.id || "" },
        ], true); // Reset page to 1 atomically
        toast.success("Đã áp dụng bộ lọc");
    };

    // Handle Approve User
    const handleApproveUser = (userId: string, userName: string) => {
        setAlertDialogConfig({
            title: "Xác nhận duyệt",
            description: `Bạn có chắc chắn muốn duyệt yêu cầu trở thành người bán của "${userName}"?`,
            userName: userName,
            onConfirm: async () => {
                setAlertDialogLoading(true);
                try {
                    await approveSellerRequest("APPROVED", "", Number(userId));
                    toast.success(`Đã duyệt yêu cầu của ${userName}`);
                    setAlertDialogOpen(false);
                    // Refresh users list
                    fetchUsers();
                } catch (error) {
                    console.error("Error approving user:", error);
                    toast.error("Có lỗi xảy ra khi duyệt yêu cầu");
                } finally {
                    setAlertDialogLoading(false);
                }
            }
        });
        setAlertDialogOpen(true);
    };

    // Handle Reject User - Open reject reason dialog
    const handleRejectUser = (userId: string, userName: string) => {
        setPendingUserIdForReject(userId);
        setPendingUserNameForReject(userName);
        setRejectReasonDialogOpen(true);
    };

    // Handle Reject User Confirm
    const handleRejectUserConfirm = async (reason: string) => {
        if (!pendingUserIdForReject) return;

        try {
            await approveSellerRequest("REJECTED", reason, Number(pendingUserIdForReject));
            toast.success(`Đã từ chối yêu cầu của ${pendingUserNameForReject}`);
            setRejectReasonDialogOpen(false);
            setPendingUserIdForReject(null);
            setPendingUserNameForReject("");
            // Refresh users list
            fetchUsers();
        } catch (error) {
            console.error("Error rejecting user:", error);
            toast.error("Có lỗi xảy ra khi từ chối yêu cầu");
        }
    };

    // Sync sortBy state with URL sorts
    useEffect(() => {
        if (sorts.length > 0) {
            const sort = sorts[0]; // Take first sort
            const sortKey = `${sort.key}-${sort.type.toLowerCase()}`;

            switch (sortKey) {
                case "createdAt-desc":
                    setSortBy("newest");
                    break;
                case "createdAt-asc":
                    setSortBy("oldest");
                    break;
                case "fullName-asc":
                    setSortBy("name-asc");
                    break;
                case "fullName-desc":
                    setSortBy("name-desc");
                    break;
            }
        } else {
            setSortBy("newest"); // Default sort
        }
    }, [sorts]);

    // Effects
    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, sorts, page]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
                    <p className="text-gray-600 mt-2">
                        Tổng cộng {totalUsers} người dùng
                    </p>
                </div>

                {/* Filters and Sort Section */}
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                        {/* Filter Button */}
                        <div className="relative">
                            <Button
                                onClick={handleFilterClick}
                                variant="outline"
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <Filter className="w-4 h-4" />
                                Lọc
                            </Button>
                            {getActiveFiltersCount() > 0 && (
                                <Badge
                                    variant="default"
                                    className="absolute -top-2 -right-2 h-5 min-w-5 px-1 bg-[#008DDA] hover:bg-[#008DDA]"
                                >
                                    {getActiveFiltersCount()}
                                </Badge>
                            )}
                        </div>

                        {/* Sort Select */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <span className="text-sm text-gray-600 whitespace-nowrap">
                                Sắp xếp:
                            </span>
                            <Select value={sortBy} onValueChange={handleSortChange}>
                                <SelectTrigger className="w-full sm:w-[200px] focus:ring-[#008DDA] focus:ring-2 focus:ring-offset-0 cursor-pointer">
                                    <SelectValue placeholder="Chọn cách sắp xếp" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Mới nhất</SelectItem>
                                    <SelectItem value="oldest">Cũ nhất</SelectItem>
                                    <SelectItem value="name-asc">Tên A-Z</SelectItem>
                                    <SelectItem value="name-desc">Tên Z-A</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Users List */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6">
                        {isLoading ? (
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

                                            {/* Email */}
                                            <Skeleton className="h-4 w-64" />

                                            {/* Phone */}
                                            <Skeleton className="h-4 w-40" />
                                        </div>

                                        {/* Action button skeleton */}
                                        <Skeleton className="w-24 h-10 rounded-md flex-shrink-0" />
                                    </div>
                                ))}
                            </div>
                        ) : users.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                Không có người dùng nào
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {users.map((user) => (
                                    <UserListItem
                                        key={user.id}
                                        {...user}
                                        onClick={(id) => navigate(`/nguoi-dung/${id}`)}
                                        onApprove={(id, fullName) => handleApproveUser(id, fullName)}
                                        onReject={(id, fullName) => handleRejectUser(id, fullName)}
                                    />
                                ))}
                            </div>
                        )}

                        {!isLoading && users.length > 0 && (
                            <div className="mt-6">
                                <ControlledPagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onPageChange={setPage}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Filter Dialog */}
            <UserFilterDialog
                open={filterDialogOpen}
                onOpenChange={setFilterDialogOpen}
                onApplyFilter={handleApplyFilter}
                initialFilters={getInitialFiltersForDialog()}
            />

            {/* Alert Dialog for Approve */}
            <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{alertDialogConfig?.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {alertDialogConfig?.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer" disabled={alertDialogLoading}>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                alertDialogConfig?.onConfirm();
                            }}
                            disabled={alertDialogLoading}
                            className="bg-[#008DDA] hover:bg-[#0077b6] cursor-pointer"
                        >
                            {alertDialogLoading ? "Đang xử lý..." : "Xác nhận"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Reject Reason Dialog */}
            <RejectReasonDialog
                open={rejectReasonDialogOpen}
                onOpenChange={setRejectReasonDialogOpen}
                onConfirm={handleRejectUserConfirm}
            />
        </div>
    );
}

