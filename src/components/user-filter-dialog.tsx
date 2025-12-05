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
import { SELLER_APPROVE_STATUSES } from "@/constants/sellerApproveStatuses";
import type { SellerApproveStatus } from "@/types/seller-approve-status";

interface UserFilterDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onApplyFilter: (filters: FilterValues) => void;
    initialFilters?: FilterValues;
}

export interface FilterValues {
    fullName: string | null;
    phoneNumber: string | null;
    becomeSellerApproveStatus: SellerApproveStatus | null;
}

const defaultFilters: FilterValues = {
    fullName: null,
    phoneNumber: null,
    becomeSellerApproveStatus: null,
};

export function UserFilterDialog({
    open,
    onOpenChange,
    onApplyFilter,
    initialFilters = defaultFilters,
}: UserFilterDialogProps) {
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

    const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        setFilters({ ...filters, fullName: value || null });
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow numeric input
        const value = e.target.value.replace(/\D/g, '');
        setFilters({ ...filters, phoneNumber: value || null });
    };

    const handleBecomeSellerApproveStatusChange = (value: string) => {
        if (value === "all") {
            setFilters({ ...filters, becomeSellerApproveStatus: null });
        } else {
            const status = SELLER_APPROVE_STATUSES.find(s => s.id === value);
            setFilters({ ...filters, becomeSellerApproveStatus: status || null });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Lọc người dùng</DialogTitle>
                    <DialogDescription>
                        Chọn các tiêu chí để lọc danh sách người dùng
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Full Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="fullName">Họ và tên</Label>
                        <Input
                            id="fullName"
                            type="text"
                            placeholder="Nhập họ và tên..."
                            value={filters.fullName || ""}
                            onChange={handleFullNameChange}
                            className="focus-visible:ring-[#008DDA]"
                            autoFocus={false}
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="grid gap-2">
                        <Label htmlFor="phoneNumber">Số điện thoại</Label>
                        <Input
                            id="phoneNumber"
                            type="text"
                            placeholder="Nhập số điện thoại..."
                            value={filters.phoneNumber || ""}
                            onChange={handlePhoneNumberChange}
                            className="focus-visible:ring-[#008DDA]"
                            inputMode="numeric"
                        />
                    </div>

                    {/* Become Seller Approve Status */}
                    <div className="grid gap-2">
                        <Label htmlFor="becomeSellerApproveStatus">Trạng thái người bán</Label>
                        <Select
                            value={filters.becomeSellerApproveStatus?.id || "all"}
                            onValueChange={handleBecomeSellerApproveStatusChange}
                        >
                            <SelectTrigger
                                id="becomeSellerApproveStatus"
                                className="focus:ring-[#008DDA] focus:ring-2 focus:ring-offset-0 cursor-pointer w-full"
                            >
                                <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                {SELLER_APPROVE_STATUSES.map((status) => (
                                    <SelectItem key={status.id} value={status.id}>
                                        {status.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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

