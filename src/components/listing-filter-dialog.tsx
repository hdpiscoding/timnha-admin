import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PROPERTY_TYPES } from "@/constants/propertyTypes";
import { DISTRICTS } from "@/constants/districts";
import type { PropertyType } from "@/types/property-type";
import type { District } from "@/types/district";

interface ListingFilterDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onApplyFilter: (filters: FilterValues) => void;
    initialFilters?: FilterValues;
}

export interface FilterValues {
    approvalStatus: "NONE" | "PENDING" | "APPROVED" | "REJECTED" | null;
    title: string | null;
    listingType: "for_sale" | "for_rent" | null;
    price: number | null;
    area: number | null;
    propertyType: PropertyType | null;
    numBedrooms: number | null;
    numBathrooms: number | null;
    numFloors: number | null;
    addressDistrict: District | null;
}

const defaultFilters: FilterValues = {
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
};

export function ListingFilterDialog({
    open,
    onOpenChange,
    onApplyFilter,
    initialFilters = defaultFilters,
}: ListingFilterDialogProps) {
    const [filters, setFilters] = useState<FilterValues>(initialFilters);

    useEffect(() => {
        if (open) {
            setFilters(initialFilters);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const handleApply = () => {
        onApplyFilter(filters);
        onOpenChange(false);
    };

    const handleReset = () => {
        setFilters(defaultFilters);
    };

    const handleApprovalStatusChange = (value: string) => {
        if (value === "all") {
            setFilters({ ...filters, approvalStatus: null });
        } else {
            setFilters({
                ...filters,
                approvalStatus: value as "NONE" | "PENDING" | "APPROVED" | "REJECTED",
            });
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        setFilters({ ...filters, title: value || null });
    };

    const handleListingTypeChange = (value: string) => {
        if (value === "all") {
            setFilters({ ...filters, listingType: null });
        } else {
            setFilters({ ...filters, listingType: value as "for_sale" | "for_rent" });
        }
    };

    const handlePropertyTypeChange = (value: string) => {
        if (value === "all") {
            setFilters({ ...filters, propertyType: null });
        } else {
            const propertyType = PROPERTY_TYPES.find(pt => pt.id === value);
            setFilters({ ...filters, propertyType: propertyType || null });
        }
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        setFilters({ ...filters, price: value ? Number(value) : null });
    };

    const handleAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        setFilters({ ...filters, area: value ? Number(value) : null });
    };

    const handleDistrictChange = (value: string) => {
        if (value === "all") {
            setFilters({ ...filters, addressDistrict: null });
        } else {
            const district = DISTRICTS.find(d => d.id === value);
            setFilters({ ...filters, addressDistrict: district || null });
        }
    };

    const handleNumBedroomsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        setFilters({ ...filters, numBedrooms: value ? Number(value) : null });
    };

    const handleNumBathroomsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        setFilters({ ...filters, numBathrooms: value ? Number(value) : null });
    };

    const handleNumFloorsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        setFilters({ ...filters, numFloors: value ? Number(value) : null });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Lọc tin đăng</DialogTitle>
                    <DialogDescription>
                        Chọn các tiêu chí để lọc danh sách tin đăng
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Row 1: Approval Status, Listing Type, Property Type */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Approval Status */}
                        <div className="grid gap-2">
                            <Label htmlFor="approvalStatus">Trạng thái duyệt</Label>
                            <Select
                                value={filters.approvalStatus || "all"}
                                onValueChange={handleApprovalStatusChange}
                            >
                                <SelectTrigger
                                    id="approvalStatus"
                                    className="focus:ring-[#008DDA] focus:ring-2 focus:ring-offset-0 cursor-pointer w-full"
                                >
                                    <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="NONE">Chưa duyệt</SelectItem>
                                    <SelectItem value="PENDING">Đang chờ duyệt</SelectItem>
                                    <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                                    <SelectItem value="REJECTED">Đã từ chối</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Listing Type */}
                        <div className="grid gap-2">
                            <Label htmlFor="listingType">Loại tin</Label>
                            <Select
                                value={filters.listingType || "all"}
                                onValueChange={handleListingTypeChange}
                            >
                                <SelectTrigger
                                    id="listingType"
                                    className="focus:ring-[#008DDA] focus:ring-2 focus:ring-offset-0 cursor-pointer w-full"
                                >
                                    <SelectValue placeholder="Chọn loại tin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="for_sale">Bán</SelectItem>
                                    <SelectItem value="for_rent">Cho thuê</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Property Type */}
                        <div className="grid gap-2">
                            <Label htmlFor="propertyType">Loại bất động sản</Label>
                            <Select
                                value={filters.propertyType?.id || "all"}
                                onValueChange={handlePropertyTypeChange}
                            >
                                <SelectTrigger
                                    id="propertyType"
                                    className="focus:ring-[#008DDA] focus:ring-2 focus:ring-offset-0 cursor-pointer w-full"
                                >
                                    <SelectValue placeholder="Chọn loại BDS" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    {PROPERTY_TYPES.map((type) => (
                                        <SelectItem key={type.id} value={type.id}>
                                            {type.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="grid gap-2">
                        <Label htmlFor="title">Tiêu đề</Label>
                        <Input
                            id="title"
                            type="text"
                            placeholder="Nhập tiêu đề tin đăng..."
                            value={filters.title || ""}
                            onChange={handleTitleChange}
                            className="focus-visible:ring-[#008DDA]"
                        />
                    </div>

                    {/* Row 2: Price and Area */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Price */}
                        <div className="grid gap-2">
                            <Label htmlFor="price">Giá (VNĐ)</Label>
                            <Input
                                id="price"
                                type="number"
                                placeholder="Nhập giá..."
                                value={filters.price || ""}
                                onChange={handlePriceChange}
                                className="focus-visible:ring-[#008DDA]"
                                min="0"
                            />
                        </div>

                        {/* Area */}
                        <div className="grid gap-2">
                            <Label htmlFor="area">Diện tích (m²)</Label>
                            <Input
                                id="area"
                                type="number"
                                placeholder="Nhập diện tích..."
                                value={filters.area || ""}
                                onChange={handleAreaChange}
                                className="focus-visible:ring-[#008DDA]"
                                min="0"
                            />
                        </div>
                    </div>

                    {/* District */}
                    <div className="grid gap-2">
                        <Label htmlFor="district">Quận/Huyện</Label>
                        <Select
                            value={filters.addressDistrict?.id || "all"}
                            onValueChange={handleDistrictChange}
                        >
                            <SelectTrigger
                                id="district"
                                className="focus:ring-[#008DDA] focus:ring-2 focus:ring-offset-0 cursor-pointer w-full"
                            >
                                <SelectValue placeholder="Chọn quận/huyện" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                {DISTRICTS.map((district) => (
                                    <SelectItem key={district.id} value={district.id}>
                                        {district.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Row 3: Bedrooms, Bathrooms, Floors */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Bedrooms */}
                        <div className="grid gap-2">
                            <Label htmlFor="numBedrooms">Số phòng ngủ</Label>
                            <Input
                                id="numBedrooms"
                                type="number"
                                placeholder="Số phòng ngủ..."
                                value={filters.numBedrooms || ""}
                                onChange={handleNumBedroomsChange}
                                className="focus-visible:ring-[#008DDA]"
                                min="0"
                            />
                        </div>

                        {/* Bathrooms */}
                        <div className="grid gap-2">
                            <Label htmlFor="numBathrooms">Số phòng tắm</Label>
                            <Input
                                id="numBathrooms"
                                type="number"
                                placeholder="Số phòng tắm..."
                                value={filters.numBathrooms || ""}
                                onChange={handleNumBathroomsChange}
                                className="focus-visible:ring-[#008DDA]"
                                min="0"
                            />
                        </div>

                        {/* Floors */}
                        <div className="grid gap-2">
                            <Label htmlFor="numFloors">Số tầng</Label>
                            <Input
                                id="numFloors"
                                type="number"
                                placeholder="Số tầng..."
                                value={filters.numFloors || ""}
                                onChange={handleNumFloorsChange}
                                className="focus-visible:ring-[#008DDA]"
                                min="0"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        className="cursor-pointer"
                    >
                        Đặt lại
                    </Button>
                    <Button
                        type="button"
                        onClick={handleApply}
                        className="cursor-pointer bg-[#008DDA] hover:bg-[#0077b6]"
                    >
                        Áp dụng
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

