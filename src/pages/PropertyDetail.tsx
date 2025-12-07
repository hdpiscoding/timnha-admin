import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
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
import {
    ArrowLeft,
    Check,
    X,
    MapPin,
    Home,
    Bed,
    Bath,
    Maximize,
    Layers,
    Calendar,
    Building2, Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import type { PropertyListing } from "@/types/property-listing";
import {formatDateTime, formatPrice} from "@/utils/generalFormat.ts";
import StaticMarkerMap from "@/components/static-marker-map";
import { getPropertyDetails, approveListingRequest } from "@/services/propertyServices";

export default function PropertyDetail() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [property, setProperty] = useState<PropertyListing | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

    // Fetch property data
    useEffect(() => {
        const fetchProperty = async () => {
            if (!id) {
                toast.error("ID tin đăng không hợp lệ");
                navigate("/tin-dang");
                return;
            }

            setIsLoading(true);
            try {
                const response = await getPropertyDetails(id);
                setProperty(response.data);
            } catch (error) {
                console.error("Error fetching property:", error);
                toast.error("Không thể tải thông tin tin đăng");
                navigate("/tin-dang");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProperty();
    }, [id, navigate]);

    // Handle Approve
    const handleApprove = () => {
        setApproveDialogOpen(true);
    };

    const handleApproveConfirm = async () => {
        if (!id) return;

        try {
            await approveListingRequest("APPROVED", Number(id));

            toast.success("Đã duyệt tin đăng thành công");
            setApproveDialogOpen(false);
            navigate("/tin-dang");
        } catch (error) {
            console.error("Error approving listing:", error);
            toast.error("Có lỗi xảy ra khi duyệt tin đăng");
        }
    };

    // Handle Reject
    const handleReject = () => {
        setRejectDialogOpen(true);
    };

    const handleRejectConfirm = async () => {
        if (!id) return;

        try {
            await approveListingRequest("REJECTED", Number(id));

            toast.success("Đã từ chối tin đăng");
            setRejectDialogOpen(false);
            navigate("/tin-dang");
        } catch (error) {
            console.error("Error rejecting listing:", error);
            toast.error("Có lỗi xảy ra khi từ chối tin đăng");
        }
    };

    // Get status badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING":
                return <Badge className="bg-yellow-500 hover:bg-yellow-600">Chờ duyệt</Badge>;
            case "APPROVED":
                return <Badge className="bg-green-500 hover:bg-green-600">Đã duyệt</Badge>;
            case "REJECTED":
                return <Badge className="bg-red-500 hover:bg-red-600">Đã từ chối</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    // Get listing type badge
    const getListingTypeBadge = (type: string) => {
        return type === "for_sale" ? (
            <Badge variant="outline" className="border-blue-500 text-blue-600">
                Bán
            </Badge>
        ) : (
            <Badge variant="outline" className="border-green-500 text-green-600">
                Cho thuê
            </Badge>
        );
    };

    // Get property type label
    const getPropertyTypeLabel = (type: string) => {
        const types: Record<string, string> = {
            apartment: "Chung cư",
            house: "Nhà riêng",
            villa: "Biệt thự",
            townhouse: "Nhà phố",
            land: "Đất nền",
        };
        return types[type] || type;
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-[#008DDA] animate-spin" />
                    <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Không tìm thấy thông tin tin đăng</p>
                    <Button
                        onClick={() => navigate("/tin-dang")}
                        className="mt-4 bg-[#008DDA] hover:bg-[#0077b6] cursor-pointer"
                    >
                        Quay lại
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Back Button */}
                <Button
                    onClick={() => navigate("/tin-dang")}
                    variant="outline"
                    className="mb-4 cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại
                </Button>

                {/* Image Carousel */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    {property.imageUrls && property.imageUrls.length > 0 ? (
                        <Carousel className="w-full">
                            <CarouselContent>
                                {property.imageUrls.map((url, index) => (
                                    <CarouselItem key={index}>
                                        <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden">
                                            <img
                                                src={url}
                                                alt={`${property.title} - ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            {property.imageUrls.length > 1 && (
                                <>
                                    <CarouselPrevious className="left-4 cursor-pointer" />
                                    <CarouselNext className="right-4 cursor-pointer" />
                                </>
                            )}
                        </Carousel>
                    ) : (
                        <div className="w-full h-[400px] bg-gray-200 rounded-lg flex items-center justify-center">
                            <Building2 className="w-20 h-20 text-gray-400" />
                        </div>
                    )}
                </div>

                {/* Title and Basic Info */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="space-y-4">
                        {/* Title */}
                        <h1 className="text-3xl font-bold text-gray-900">
                            {property.title}
                        </h1>

                        {/* Listing Type Badge */}
                        <div>
                            {getListingTypeBadge(property.listingType)}
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-bold text-[#008DDA]">
                                {formatPrice(property.price)} VNĐ
                            </span>
                        </div>

                        {/* Address */}
                        <div className="flex items-start gap-2 text-gray-700">
                            <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                            <span className="text-lg">
                                {property.addressWard}, {property.addressDistrict}, {property.addressCity}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Approval Status Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Status Badge */}
                        <div className="flex items-center gap-3">
                            <span className="text-gray-700 font-semibold text-lg">Trạng thái duyệt:</span>
                            {getStatusBadge(property.approvalStatus)}
                        </div>

                        {/* Approve/Reject Buttons - Show only if PENDING */}
                        {property.approvalStatus === "PENDING" && (
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleApprove}
                                    className="bg-green-600 hover:bg-green-700 cursor-pointer flex-1 sm:flex-none"
                                >
                                    <Check className="w-4 h-4 mr-2" />
                                    Duyệt
                                </Button>
                                <Button
                                    onClick={handleReject}
                                    variant="destructive"
                                    className="cursor-pointer hover:bg-red-700 flex-1 sm:flex-none"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Từ chối
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Property Details */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Thông tin chi tiết
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {/* Property Type */}
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Home className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Loại hình</p>
                                <p className="font-semibold text-gray-900">
                                    {getPropertyTypeLabel(property.propertyType)}
                                </p>
                            </div>
                        </div>

                        {/* Area */}
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Maximize className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Diện tích</p>
                                <p className="font-semibold text-gray-900">{property.area} m²</p>
                            </div>
                        </div>

                        {/* Bedrooms */}
                        {property.numBedrooms !== null && (
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Bed className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Phòng ngủ</p>
                                    <p className="font-semibold text-gray-900">{property.numBedrooms}</p>
                                </div>
                            </div>
                        )}

                        {/* Bathrooms */}
                        {property.numBathrooms !== null && (
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <Bath className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Phòng tắm</p>
                                    <p className="font-semibold text-gray-900">{property.numBathrooms}</p>
                                </div>
                            </div>
                        )}

                        {/* Floors */}
                        {property.numFloors !== null && (
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                    <Layers className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Số tầng</p>
                                    <p className="font-semibold text-gray-900">{property.numFloors}</p>
                                </div>
                            </div>
                        )}

                        {/* Created Date */}
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-teal-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Ngày đăng</p>
                                <p className="font-semibold text-gray-900 text-sm">
                                    {formatDateTime(property.createdAt)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Mô tả
                    </h2>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {property.description}
                    </p>
                </div>

                {/* Map Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Vị trí
                    </h2>
                    <div className="w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden">
                        <StaticMarkerMap
                            location={{
                                address: `${property.addressStreet ? property.addressStreet + ', ' : ''}${property.addressWard}, ${property.addressDistrict}, ${property.addressCity}`,
                                latitude: property.location.coordinates[1],
                                longitude: property.location.coordinates[0]
                            }}
                            defaultZoom={16}
                            height="100%"
                            width="100%"
                            showNavigation={true}
                        />
                    </div>
                </div>
            </div>

            {/* Approve Dialog */}
            <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận duyệt</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn duyệt tin đăng{" "}
                            <span className="font-semibold">"{property.title}"</span>?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleApproveConfirm}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Xác nhận
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Reject Dialog */}
            <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận từ chối</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn từ chối tin đăng{" "}
                            <span className="font-semibold">"{property.title}"</span>?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleRejectConfirm}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Xác nhận
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

