import { useState, useEffect } from "react";
import { UserListItem } from "@/components/user-list-item";
import { ControlledPagination } from "@/components/ui/controlled-pagination";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { toast } from "react-toastify";

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
    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [sortBy, setSortBy] = useState<SortOption>("newest");

    // Fetch Users
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const fetchUsers = async (_page: number, _sort: SortOption) => {
        setIsLoading(true);
        try {
            // TODO: Call API to get users
            // const response = await getUsers(_page, _sort);

            // Mock data
            const mockUsers: User[] = [
                {
                    id: "1",
                    fullName: "Nguyễn Văn A",
                    email: "nguyenvana@example.com",
                    phoneNumber: "0901234567",
                    createdAt: "2024-01-15T10:30:00Z",
                },
                {
                    id: "2",
                    avatarUrl: "https://via.placeholder.com/150",
                    fullName: "Trần Thị B",
                    email: "tranthib@example.com",
                    phoneNumber: "0912345678",
                    createdAt: "2024-01-14T15:20:00Z",
                },
                {
                    id: "3",
                    fullName: "Lê Văn C",
                    email: "levanc@example.com",
                    phoneNumber: "0923456789",
                    createdAt: "2024-01-13T09:15:00Z",
                },
                {
                    id: "4",
                    avatarUrl: "https://via.placeholder.com/150",
                    fullName: "Phạm Thị D",
                    email: "phamthid@example.com",
                    phoneNumber: "0934567890",
                    createdAt: "2024-01-12T14:45:00Z",
                },
                {
                    id: "5",
                    fullName: "Hoàng Văn E",
                    email: "hoangvane@example.com",
                    phoneNumber: "0945678901",
                    createdAt: "2024-01-11T11:20:00Z",
                },
            ];

            setUsers(mockUsers);
            setTotalPages(3); // Mock total pages
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
        setCurrentPage(1); // Reset to first page when sorting changes
    };

    // Handle Filter Click
    const handleFilterClick = () => {
        // TODO: Implement filter modal or drawer
        toast.info("Chức năng lọc đang được phát triển");
    };

    // Effects
    useEffect(() => {
        fetchUsers(currentPage, sortBy);
    }, [currentPage, sortBy]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
                    <p className="text-gray-600 mt-2">
                        Tổng cộng {users.length} người dùng
                    </p>
                </div>

                {/* Filters and Sort Section */}
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                        {/* Filter Button */}
                        <Button
                            onClick={handleFilterClick}
                            variant="outline"
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <Filter className="w-4 h-4" />
                            Lọc
                        </Button>

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
                            <div className="text-center py-12 text-gray-500">
                                Đang tải dữ liệu...
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
                                    />
                                ))}
                            </div>
                        )}

                        {!isLoading && users.length > 0 && (
                            <div className="mt-6">
                                <ControlledPagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

