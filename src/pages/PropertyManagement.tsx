/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { ListingFilterDialog, type FilterValues } from "@/components/listing-filter-dialog";
import { Filter } from "lucide-react";
import { toast } from "react-toastify";
import { searchProperties, approveListingRequest } from "@/services/propertyServices";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchQuery } from "@/hooks/use-search-query";
import { getPriceRangeValue } from "@/utils/priceRangesHelper";
import { getAreaRangeValue } from "@/utils/areaRangeHelper";
import { getDistrictNameById } from "@/utils/districtHelper";
import {useNavigate} from "react-router-dom";
import type {PropertyListing} from "@/types/property-listing";

type SortOption = "newest" | "oldest" | "price-asc" | "price-desc" | "area-asc" | "area-desc";

export default function PropertyManagement() {
    const [properties, setProperties] = useState<PropertyListing[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [sortBy, setSortBy] = useState<SortOption>("newest");
    const [totalListings, setTotalListings] = useState(0);
    const navigate = useNavigate();

    // Use search query hook for URL sync
    const { filters, sorts, page, setMultipleFilters, setSingleSort, setPage } = useSearchQuery();

    // Filter Dialog State
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);

    // Alert Dialog State
    const [alertDialogOpen, setAlertDialogOpen] = useState(false);
    const [alertDialogLoading, setAlertDialogLoading] = useState(false);
    const [alertDialogConfig, setAlertDialogConfig] = useState<{
        title: string;
        description: string;
        propertyTitle: string;
        onConfirm: () => Promise<void>;
    } | null>(null);

    // Handle Sort Change
    const handleSortChange = (value: SortOption) => {
        setSortBy(value);

        // Use setSingleSort from hook to clear all sorts and set new one atomically (with page reset)
        switch (value) {
            case "newest":
                setSingleSort("createdAt", "DESC", false);
                break;
            case "oldest":
                setSingleSort("createdAt", "ASC", false);
                break;
            case "price-desc":
                setSingleSort("price", "DESC", false);
                break;
            case "price-asc":
                setSingleSort("price", "ASC", false);
                break;
            case "area-desc":
                setSingleSort("area", "DESC", false);
                break;
            case "area-asc":
                setSingleSort("area", "ASC", false);
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

    // Build initial filters from URL filters for dialog
    const getInitialFiltersForDialog = (): FilterValues => {
        // Find filters from URL
        const approvalStatusFilter = filters.find(f => f.key === 'approvalStatus' && f.operator === 'eq');
        const listingTypeFilter = filters.find(f => f.key === 'listingType' && f.operator === 'eq');
        const propertyTypeFilter = filters.find(f => f.key === 'propertyType' && f.operator === 'eq');
        const priceFilter = filters.find(f => f.key === 'price' && f.operator === 'rng');
        const areaFilter = filters.find(f => f.key === 'area' && f.operator === 'rng');
        const districtFilter = filters.find(f => f.key === 'addressDistrict' && f.operator === 'eq');
        const titleFilter = filters.find(f => f.key === 'title' && f.operator === 'lk');
        const numBedroomsFilter = filters.find(f => f.key === 'numBedrooms' && f.operator === 'eq');
        const numBathroomsFilter = filters.find(f => f.key === 'numBathrooms' && f.operator === 'eq');
        const numFloorsFilter = filters.find(f => f.key === 'numFloors' && f.operator === 'eq');

        return {
            approvalStatus: approvalStatusFilter ? approvalStatusFilter.value as "NONE" | "PENDING" | "APPROVED" | "REJECTED" : null,
            listingType: listingTypeFilter ? listingTypeFilter.value as "for_sale" | "for_rent" : null,
            propertyType: propertyTypeFilter ? { id: propertyTypeFilter.value, name: propertyTypeFilter.value } : null,
            price: priceFilter ? priceFilter.value : null,
            area: areaFilter ? areaFilter.value : null,
            addressDistrict: districtFilter ? { id: districtFilter.value, name: getDistrictNameById(districtFilter.value) || districtFilter.value } : null,
            title: titleFilter ? titleFilter.value : null,
            numBedrooms: numBedroomsFilter ? parseInt(numBedroomsFilter.value) : null,
            numBathrooms: numBathroomsFilter ? parseInt(numBathroomsFilter.value) : null,
            numFloors: numFloorsFilter ? parseInt(numFloorsFilter.value) : null,
        };
    };

    // Handle Apply Filter
    const handleApplyFilter = (newFilters: FilterValues) => {
        setMultipleFilters([
            { key: "approvalStatus", operator: "eq", value: newFilters.approvalStatus || "" },
            { key: "listingType", operator: "eq", value: newFilters.listingType || "" },
            { key: "propertyType", operator: "eq", value: newFilters.propertyType?.id || "" },
            { key: "price", operator: "rng", value: newFilters.price || "" },
            { key: "area", operator: "rng", value: newFilters.area || "" },
            { key: "addressDistrict", operator: "eq", value: newFilters.addressDistrict?.id || "" },
            { key: "title", operator: "lk", value: newFilters.title?.trim() || "" },
            { key: "numBedrooms", operator: "eq", value: newFilters.numBedrooms || "" },
            { key: "numBathrooms", operator: "eq", value: newFilters.numBathrooms || "" },
            { key: "numFloors", operator: "eq", value: newFilters.numFloors || "" },
        ], true);
    };

    // Handle Approve Property
    const handleApproveProperty = (propertyId: string, propertyTitle: string) => {
        setAlertDialogConfig({
            title: "Xác nhận duyệt",
            description: `Bạn có chắc chắn muốn duyệt tin đăng "${propertyTitle}"?`,
            propertyTitle: propertyTitle,
            onConfirm: async () => {
                setAlertDialogLoading(true);
                try {
                    await approveListingRequest("APPROVED", Number(propertyId));
                    toast.success(`Đã duyệt tin đăng "${propertyTitle}"`);
                    setAlertDialogOpen(false);
                    // Trigger re-fetch
                    setPage(page);
                } catch (error) {
                    toast.error("Có lỗi xảy ra khi duyệt tin đăng");
                } finally {
                    setAlertDialogLoading(false);
                }
            }
        });
        setAlertDialogOpen(true);
    };

    // Handle Reject Property
    const handleRejectProperty = (propertyId: string, propertyTitle: string) => {
        setAlertDialogConfig({
            title: "Xác nhận từ chối",
            description: `Bạn có chắc chắn muốn từ chối tin đăng "${propertyTitle}"?`,
            propertyTitle: propertyTitle,
            onConfirm: async () => {
                setAlertDialogLoading(true);
                try {
                    await approveListingRequest("REJECTED", Number(propertyId));
                    toast.success(`Đã từ chối tin đăng "${propertyTitle}"`);
                    setAlertDialogOpen(false);
                    // Trigger re-fetch
                    setPage(page);
                } catch (error) {
                    console.error("Error rejecting property:", error);
                    toast.error("Có lỗi xảy ra khi từ chối tin đăng");
                } finally {
                    setAlertDialogLoading(false);
                }
            }
        });
        setAlertDialogOpen(true);
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
                case "price-desc":
                    setSortBy("price-desc");
                    break;
                case "price-asc":
                    setSortBy("price-asc");
                    break;
                case "area-desc":
                    setSortBy("area-desc");
                    break;
                case "area-asc":
                    setSortBy("area-asc");
                    break;
            }
        } else {
            setSortBy("newest"); // Default sort
        }
    }, [sorts]);

    // Fetch properties based on filters from URL
    useEffect(() => {
        // Fetch Properties
        const fetchProperties = async () => {
            setIsLoading(true);
            try {
                // Convert filters from URL to API format
                const apiFilters = filters.map(filter => {
                    let apiValue = filter.value;

                    // Convert price/area IDs to min-max values for API
                    if (filter.key === 'price' && filter.operator === 'rng' && filter.value) {
                        const priceMinMax = getPriceRangeValue(filter.value);
                        if (priceMinMax) {
                            apiValue = priceMinMax;
                        }
                    } else if (filter.key === 'area' && filter.operator === 'rng' && filter.value) {
                        const areaMinMax = getAreaRangeValue(filter.value);
                        if (areaMinMax) {
                            apiValue = areaMinMax;
                        }
                    } else if (filter.key === 'addressDistrict' && filter.operator === 'eq' && filter.value) {
                        // Convert district ID to name for API
                        const districtName = getDistrictNameById(filter.value);
                        if (districtName) {
                            apiValue = districtName;
                        }
                    }

                    return {
                        key: filter.key,
                        operator: filter.operator === 'eq' ? 'equal' :
                            filter.operator === 'gt' ? 'greater' :
                                filter.operator === 'lt' ? 'less' :
                                    filter.operator === 'gte' ? 'greater_equal' :
                                        filter.operator === 'lte' ? 'less_equal' :
                                            filter.operator === 'lk' ? 'like' :
                                                filter.operator === 'rng' ? 'range' : 'equal',
                        value: apiValue
                    };
                });

                // Build API sorts from URL sorts
                const apiSorts = sorts.map(sort => ({
                    key: sort.key,
                    type: sort.type
                }));

                // Call API to get properties with page from URL
                const response = await searchProperties({
                    filters: apiFilters,
                    sorts: apiSorts,
                    rpp: 5,
                    page: page, // Use page from URL
                });

                setTotalListings(response.data.records || 0);

                // Keep the full PropertyListing objects from API
                setProperties(response.data.items);
                setTotalPages(response.data.pages || 1);
            } catch (error) {
                // console.error("Error fetching properties:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProperties();
    }, [filters, sorts, page]);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [page]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý tin đăng</h1>
                    <p className="text-gray-600 mt-2">
                        Tổng cộng {totalListings} tin đăng
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
                            <div className="space-y-4">
                                {/* Show 3 skeleton items while loading */}
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                                        {/* Image skeleton */}
                                        <Skeleton className="w-48 h-32 rounded-lg flex-shrink-0" />

                                        {/* Content skeleton */}
                                        <div className="flex-1 space-y-3">
                                            {/* Title */}
                                            <Skeleton className="h-6 w-3/4" />

                                            {/* Price and Area */}
                                            <div className="flex gap-4">
                                                <Skeleton className="h-5 w-32" />
                                                <Skeleton className="h-5 w-24" />
                                            </div>

                                            {/* Address */}
                                            <Skeleton className="h-4 w-2/3" />

                                            {/* Date */}
                                            <Skeleton className="h-4 w-40" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : properties.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                Không có tin đăng nào
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {properties.map((property) => {
                                    // Build full address, filtering out empty values
                                    const addressParts = [
                                        property.addressStreet,
                                        property.addressWard,
                                        property.addressDistrict,
                                        property.addressCity,
                                    ].filter(Boolean);
                                    const fullAddress = addressParts.join(", ");

                                    return (
                                        <PropertyListItem
                                            key={property.id}
                                            id={property.id.toString()}
                                            title={property.title}
                                            price={property.price}
                                            area={property.area}
                                            address={fullAddress}
                                            imageUrl={property.imageUrls?.[0] || ""}
                                            createdAt={property.createdAt}
                                            approvalStatus={property.approvalStatus as "NONE" | "PENDING" | "APPROVED" | "REJECTED"}
                                            onClick={() => navigate(`/tin-dang/${property.id}`)}
                                            onApprove={(id) => handleApproveProperty(id, property.title)}
                                            onReject={(id) => handleRejectProperty(id, property.title)}
                                        />
                                    );
                                })}
                            </div>
                        )}

                        {!isLoading && properties.length > 0 && (
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
            <ListingFilterDialog
                open={filterDialogOpen}
                onOpenChange={setFilterDialogOpen}
                onApplyFilter={handleApplyFilter}
                initialFilters={getInitialFiltersForDialog()}
            />

            {/* Alert Dialog for Approve/Reject */}
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
        </div>
    );
}

