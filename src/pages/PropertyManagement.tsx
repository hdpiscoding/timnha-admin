import { useState, useEffect } from "react";
import { PropertyListItem } from "@/components/property-list-item";
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
import { ListingFilterDialog, type FilterValues } from "@/components/listing-filter-dialog";
import { Filter } from "lucide-react";
import { toast } from "react-toastify";

// Types
interface Property {
    id: string;
    title: string;
    price: number;
    area: number;
    address: string;
    imageUrl: string;
    createdAt: string;
}

type SortOption = "newest" | "oldest" | "price-asc" | "price-desc" | "area-asc" | "area-desc";

export default function PropertyManagement() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [sortBy, setSortBy] = useState<SortOption>("newest");

    // Filter Dialog State
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);
    const [filters, setFilters] = useState<FilterValues>({
        approvalStatus: null,
        title: null,
        listingType: null,
        price: null,
        area: null,
        propertyType: null,
        numBedrooms: null,
        numBathrooms: null,
        numFloors: null,
        addressDistrict: null,
    });

    // Fetch Properties
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const fetchProperties = async (_page: number, _sort: SortOption) => {
        setIsLoading(true);
        try {
            // TODO: Call API to get properties
            // const response = await getProperties(_page, _sort);

            // Mock data
            const mockProperties: Property[] = [
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
                {
                    id: "3",
                    title: "Bán biệt thự cao cấp khu Thảo Điền",
                    price: 15000000000,
                    area: 200,
                    address: "Khu Thảo Điền, Quận 2, TP. Hồ Chí Minh",
                    imageUrl: "https://via.placeholder.com/400x300",
                    createdAt: "2024-01-13T09:15:00Z",
                },
                {
                    id: "4",
                    title: "Cho thuê mặt bằng kinh doanh đường Trần Hưng Đạo",
                    price: 30000000,
                    area: 100,
                    address: "Đường Trần Hưng Đạo, Quận 1, TP. Hồ Chí Minh",
                    imageUrl: "https://via.placeholder.com/400x300",
                    createdAt: "2024-01-12T14:45:00Z",
                },
                {
                    id: "5",
                    title: "Bán nhà phố 3 tầng khu Bình Tân",
                    price: 3500000000,
                    area: 60,
                    address: "Quận Bình Tân, TP. Hồ Chí Minh",
                    imageUrl: "https://via.placeholder.com/400x300",
                    createdAt: "2024-01-11T11:20:00Z",
                },
            ];

            setProperties(mockProperties);
            setTotalPages(5); // Mock total pages
        } catch (error) {
            console.error("Error fetching properties:", error);
            toast.error("Không thể tải danh sách tin đăng");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Sort Change
    const handleSortChange = (value: SortOption) => {
        setSortBy(value);
        setCurrentPage(1); // Reset to first page when sorting changes
    };

    // Count active filters
    const getActiveFiltersCount = () => {
        let count = 0;
        if (filters.approvalStatus !== null) count++;
        if (filters.title !== null) count++;
        if (filters.listingType !== null) count++;
        if (filters.price !== null) count++;
        if (filters.area !== null) count++;
        if (filters.propertyType !== null) count++;
        if (filters.numBedrooms !== null) count++;
        if (filters.numBathrooms !== null) count++;
        if (filters.numFloors !== null) count++;
        if (filters.addressDistrict !== null) count++;
        return count;
    };

    // Handle Filter Click
    const handleFilterClick = () => {
        setFilterDialogOpen(true);
    };

    // Handle Apply Filter
    const handleApplyFilter = (newFilters: FilterValues) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to first page when filters change

        // TODO: Call API with filters
        console.log("Applied filters:", newFilters);
        toast.success("Đã áp dụng bộ lọc");

        // For now, just refresh with current sort
        fetchProperties(1, sortBy);
    };

    // Effects
    useEffect(() => {
        fetchProperties(currentPage, sortBy);
    }, [currentPage, sortBy]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý tin đăng</h1>
                    <p className="text-gray-600 mt-2">
                        Tổng cộng {properties.length} tin đăng
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
                            <Select value={sortBy} onValueChange={handleSortChange} >
                                <SelectTrigger className="w-full sm:w-[200px] focus:ring-[#008DDA] focus:ring-2 focus:ring-offset-0 cursor-pointer">
                                    <SelectValue placeholder="Chọn cách sắp xếp" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Mới nhất</SelectItem>
                                    <SelectItem value="oldest">Cũ nhất</SelectItem>
                                    <SelectItem value="price-desc">Giá cao đến thấp</SelectItem>
                                    <SelectItem value="price-asc">Giá thấp đến cao</SelectItem>
                                    <SelectItem value="area-desc">Diện tích lớn đến nhỏ</SelectItem>
                                    <SelectItem value="area-asc">Diện tích nhỏ đến lớn</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Properties List */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6">
                        {isLoading ? (
                            <div className="text-center py-12 text-gray-500">
                                Đang tải dữ liệu...
                            </div>
                        ) : properties.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                Không có tin đăng nào
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {properties.map((property) => (
                                    <PropertyListItem
                                        key={property.id}
                                        {...property}
                                    />
                                ))}
                            </div>
                        )}

                        {!isLoading && properties.length > 0 && (
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

            {/* Filter Dialog */}
            <ListingFilterDialog
                open={filterDialogOpen}
                onOpenChange={setFilterDialogOpen}
                onApplyFilter={handleApplyFilter}
                initialFilters={filters}
            />
        </div>
    );
}

