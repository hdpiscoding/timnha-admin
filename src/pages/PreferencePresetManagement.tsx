/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { PreferencePresetListItem } from "@/components/preference-preset-list-item";
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
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import type { PreferencePreset } from "@/types/preference-preset";
import {useNavigate} from "react-router-dom";
import { getAllPreferencePresets, deletePreferencePreset } from "@/services/preferencePresetServices";
import { Skeleton } from "@/components/ui/skeleton";

export default function PreferencePresetManagement() {
    const [presets, setPresets] = useState<PreferencePreset[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Alert Dialog State
    const [alertDialogOpen, setAlertDialogOpen] = useState(false);
    const [presetToDelete, setPresetToDelete] = useState<PreferencePreset | null>(null);

    // Fetch Preference Presets
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const fetchPresets = async (_page: number) => {
        setIsLoading(true);
        try {
            const response = await getAllPreferencePresets();

            // Map API response data, converting decimal values (0.00-1.00) to percentages (0-100)
            const mappedPresets: PreferencePreset[] = response.data.map((preset: PreferencePreset) => ({
                id: preset.id,
                name: preset.name,
                description: preset.description,
                image: preset.image,
                createAt: preset.createAt,
                preferenceSafety: Math.round(preset.preferenceSafety * 100),
                preferenceHealthcare: Math.round(preset.preferenceHealthcare * 100),
                preferenceEducation: Math.round(preset.preferenceEducation * 100),
                preferenceShopping: Math.round(preset.preferenceShopping * 100),
                preferenceTransportation: Math.round(preset.preferenceTransportation * 100),
                preferenceEnvironment: Math.round(preset.preferenceEnvironment * 100),
                preferenceEntertainment: Math.round(preset.preferenceEntertainment * 100),
            }));

            setPresets(mappedPresets);
            // Note: API doesn't provide pagination info, so we'll show all results on one page
            setTotalPages(1);
        } catch (error) {
            // Do something
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Add New Preset
    const handleAddNew = () => {
        // TODO: Navigate to create preset page or open modal
        navigate("/bo-uu-tien/tao-moi", { replace: true });
    };

    // Handle Preset Click
    const handlePresetClick = (presetId: number) => {
        // TODO: Navigate to edit preset page or open detail modal
        navigate(`/bo-uu-tien/${presetId}/chinh-sua`, { replace: true });
    };

    // Handle Delete Click - Open dialog
    const handleDeleteClick = (preset: PreferencePreset) => {
        setPresetToDelete(preset);
        setAlertDialogOpen(true);
    };

    // Handle Delete Confirm
    const handleDeleteConfirm = async () => {
        if (!presetToDelete) return;

        try {
            await deletePreferencePreset(presetToDelete.id);

            toast.success(`Đã xóa bộ ưu tiên "${presetToDelete.name}" thành công`);

            // Refresh list
            fetchPresets(currentPage);
        } catch (error) {
            console.error("Error deleting preset:", error);
            toast.error("Có lỗi xảy ra, vui lòng thử lại");
        } finally {
            setAlertDialogOpen(false);
            setPresetToDelete(null);
        }
    };

    // Effects
    useEffect(() => {
        fetchPresets(currentPage);
    }, [currentPage]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Quản lý bộ ưu tiên
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Tổng cộng {presets.length} bộ ưu tiên
                            </p>
                        </div>
                        <Button
                            onClick={handleAddNew}
                            className="flex items-center gap-2 cursor-pointer hover:bg-[#0064A6]"
                        >
                            <Plus className="w-4 h-4" />
                            Thêm mới
                        </Button>
                    </div>
                </div>

                {/* Presets List */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6">
                        {isLoading ? (
                            <div className="space-y-4">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col lg:flex-row gap-4 bg-white rounded-lg shadow-sm p-4 border border-gray-200"
                                    >
                                        {/* Skeleton for Image */}
                                        <div className="flex-shrink-0">
                                            <Skeleton className="w-24 h-24 rounded-lg" />
                                        </div>

                                        {/* Skeleton for Content */}
                                        <div className="flex flex-col flex-1 gap-2">
                                            {/* Skeleton for Name */}
                                            <Skeleton className="h-6 w-48" />

                                            {/* Skeleton for Description */}
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-3/4" />

                                            {/* Skeleton for Preferences */}
                                            <div className="flex flex-wrap gap-3 mt-1">
                                                {Array.from({ length: 7 }).map((_, idx) => (
                                                    <div key={idx} className="flex items-center gap-1.5">
                                                        <Skeleton className="w-6 h-6 rounded-md" />
                                                        <Skeleton className="h-4 w-8" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Skeleton for Delete Button */}
                                        <div className="flex gap-2 flex-shrink-0 lg:items-center lg:justify-center">
                                            <Skeleton className="h-9 w-20" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : presets.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                Không có bộ ưu tiên nào
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {presets.map((preset) => (
                                    <PreferencePresetListItem
                                        key={preset.id}
                                        preset={preset}
                                        onClick={() => handlePresetClick(preset.id)}
                                        onDelete={() => handleDeleteClick(preset)}
                                    />
                                ))}
                            </div>
                        )}

                        {!isLoading && presets.length > 0 && (
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

            {/* Alert Dialog */}
            <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa bộ ưu tiên</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa bộ ưu tiên "{presetToDelete?.name}" không?
                            Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer" onClick={() => setAlertDialogOpen(false)}>
                            Hủy
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-[#008DDA] hover:bg-[#0077b6] cursor-pointer"
                            onClick={handleDeleteConfirm}
                        >
                            Xác nhận
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

