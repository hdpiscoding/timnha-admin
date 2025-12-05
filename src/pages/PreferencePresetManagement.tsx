import { useState, useEffect } from "react";
import { PreferencePresetListItem } from "@/components/preference-preset-list-item";
import { ControlledPagination } from "@/components/ui/controlled-pagination";
import { Button } from "@/components/ui/button";
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
import { Filter, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import type { PreferencePreset } from "@/types/preference-preset";
import {useNavigate} from "react-router-dom";

type SortOption = "newest" | "oldest" | "name-asc" | "name-desc";

export default function PreferencePresetManagement() {
    const [presets, setPresets] = useState<PreferencePreset[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [sortBy, setSortBy] = useState<SortOption>("newest");
    const navigate = useNavigate();

    // Alert Dialog State
    const [alertDialogOpen, setAlertDialogOpen] = useState(false);
    const [presetToDelete, setPresetToDelete] = useState<PreferencePreset | null>(null);

    // Fetch Preference Presets
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const fetchPresets = async (_page: number, _sort: SortOption) => {
        setIsLoading(true);
        try {
            // TODO: Call API to get preference presets
            // const response = await getPreferencePresets(_page, _sort);

            // Mock data
            const mockPresets: PreferencePreset[] = [
                {
                    id: 1,
                    name: "Gia đình trẻ",
                    description: "Phù hợp cho gia đình có con nhỏ, ưu tiên giáo dục, y tế và môi trường sống an toàn.",
                    image: "https://via.placeholder.com/300x200",
                    preferenceSafety: 85,
                    preferenceHealthcare: 90,
                    preferenceEducation: 95,
                    preferenceShopping: 70,
                    preferenceTransportation: 75,
                    preferenceEnvironment: 80,
                    preferenceEntertainment: 60,
                },
                {
                    id: 2,
                    name: "Người đi làm",
                    description: "Dành cho người độc thân hoặc cặp đôi đi làm, ưu tiên giao thông, tiện ích và giải trí.",
                    image: "https://via.placeholder.com/300x200",
                    preferenceSafety: 70,
                    preferenceHealthcare: 65,
                    preferenceEducation: 50,
                    preferenceShopping: 85,
                    preferenceTransportation: 95,
                    preferenceEnvironment: 60,
                    preferenceEntertainment: 80,
                },
                {
                    id: 3,
                    name: "Người cao tuổi",
                    description: "Phù hợp cho người cao tuổi, ưu tiên y tế, môi trường yên tĩnh và an ninh.",
                    image: "https://via.placeholder.com/300x200",
                    preferenceSafety: 90,
                    preferenceHealthcare: 95,
                    preferenceEducation: 40,
                    preferenceShopping: 75,
                    preferenceTransportation: 60,
                    preferenceEnvironment: 85,
                    preferenceEntertainment: 50,
                },
                {
                    id: 4,
                    name: "Sinh viên",
                    description: "Dành cho sinh viên, ưu tiên giao thông, tiện ích mua sắm và giải trí.",
                    image: "https://via.placeholder.com/300x200",
                    preferenceSafety: 65,
                    preferenceHealthcare: 60,
                    preferenceEducation: 80,
                    preferenceShopping: 85,
                    preferenceTransportation: 90,
                    preferenceEnvironment: 55,
                    preferenceEntertainment: 85,
                },
                {
                    id: 5,
                    name: "Doanh nhân",
                    description: "Phù hợp cho doanh nhân, ưu tiên an ninh, giao thông thuận tiện và tiện ích cao cấp.",
                    image: "https://via.placeholder.com/300x200",
                    preferenceSafety: 95,
                    preferenceHealthcare: 80,
                    preferenceEducation: 70,
                    preferenceShopping: 90,
                    preferenceTransportation: 95,
                    preferenceEnvironment: 75,
                    preferenceEntertainment: 70,
                },
            ];

            setPresets(mockPresets);
            setTotalPages(2); // Mock total pages
        } catch (error) {
            console.error("Error fetching preference presets:", error);
            toast.error("Không thể tải danh sách bộ ưu tiên");
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
            // TODO: Call API to delete preset
            // await deletePreferencePreset(presetToDelete.id);

            toast.success(`Đã xóa bộ ưu tiên "${presetToDelete.name}" thành công`);

            // Refresh list
            fetchPresets(currentPage, sortBy);
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
        fetchPresets(currentPage, sortBy);
    }, [currentPage, sortBy]);

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
                            className="flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Thêm mới
                        </Button>
                    </div>
                </div>

                {/* Filters and Sort Section */}
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                        {/* Filter Button */}
                        <Button
                            onClick={handleFilterClick}
                            variant="outline"
                            className="flex items-center gap-2"
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
                                <SelectTrigger className="w-full sm:w-[200px]">
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

                {/* Presets List */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6">
                        {isLoading ? (
                            <div className="text-center py-12 text-gray-500">
                                Đang tải dữ liệu...
                            </div>
                        ) : presets.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                Không có bộ ưu tiên nào
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {presets.map((preset) => (
                                    <div
                                        key={preset.id}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="flex-1">
                                            <PreferencePresetListItem
                                                preset={preset}
                                                onClick={() => handlePresetClick(preset.id)}
                                            />
                                        </div>
                                        <div className="flex-shrink-0">
                                            <Button
                                                onClick={() => handleDeleteClick(preset)}
                                                variant="destructive"
                                                size="sm"
                                                className="cursor-pointer"
                                            >
                                                <Trash2 className="w-4 h-4 mr-1" />
                                                Xóa
                                            </Button>
                                        </div>
                                    </div>
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
                            className="cursor-pointer"
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

