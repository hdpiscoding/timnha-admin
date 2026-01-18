import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CircularProgress } from "@/components/ui/circular-progress";
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
    Building2,
    Loader2,
    TrendingUp,
    Shield,
    GraduationCap,
    ShoppingBag,
    Car,
    Leaf,
    Music,
    Heart,
    AlertTriangle, CloudRain, Milestone,
} from "lucide-react";
import { toast } from "react-toastify";
import ReactMarkdown from 'react-markdown';
import type { PropertyListing } from "@/types/property-listing";
import {formatDateTime, formatPrice} from "@/utils/generalFormat.ts";
import StaticMarkerMap from "@/components/static-marker-map";
import { getPropertyDetails, approveListingRequest, predictPropertyPrice } from "@/services/propertyServices";

interface EstimationData {
    predicted_price_billions?: number;
    livability_score?: number;
    ai_insight?: string;
    component_scores?: {
        score_safety?: number;
        score_healthcare?: number;
        score_education?: number;
        score_shopping?: number;
        score_transportation?: number;
        score_environment?: number;
        score_entertainment?: number;
        flood_impact_score?: number;
        accident_impact_score?: number;
        future_project_score?: number;
    };
}

export default function PropertyDetail() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [property, setProperty] = useState<PropertyListing | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [priceWarningDialogOpen, setPriceWarningDialogOpen] = useState(false);

    // Estimation states
    const [estimationData, setEstimationData] = useState<EstimationData | null>(null);
    const [isEstimationLoading, setIsEstimationLoading] = useState(false);
    const [estimationError, setEstimationError] = useState(false);

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

    // Fetch estimation data when property is PENDING
    useEffect(() => {
        const fetchEstimation = async () => {
            if (!property || property.approvalStatus !== "PENDING") {
                return;
            }

            setIsEstimationLoading(true);
            setEstimationError(false);

            try {
                // Map property type to API format
                const propertyTypeMap: Record<string, string> = {
                    apartment: "apartment",
                    house: "house",
                    villa: "villa",
                    townhouse: "townhouse",
                    land: "land",
                };

                const requestData = {
                    latitude: property.location.coordinates[1],
                    longitude: property.location.coordinates[0],
                    address_district: property.addressDistrict || "",
                    area: property.area,
                    property_type: propertyTypeMap[property.propertyType] || property.propertyType,
                    ...(property.numBedrooms !== null && { num_bedrooms: property.numBedrooms }),
                    ...(property.numBathrooms !== null && { num_bathrooms: property.numBathrooms }),
                    ...(property.numFloors !== null && { num_floors: property.numFloors }),
                    ...(property.facadeWidthM !== null && { facade_width_m: property.facadeWidthM }),
                    ...(property.roadWidthM !== null && { road_width_m: property.roadWidthM }),
                    ...(property.legalStatus && { legal_status: property.legalStatus }),
                    ...(property.houseDirection && { house_direction: property.houseDirection }),
                    ...(property.balconyDirection && { balcony_direction: property.balconyDirection }),
                    ...(property.furnitureStatus && { furniture_status: property.furnitureStatus }),
                    full_address: property.addressStreet ? `${property.addressStreet}, ${property.addressWard}, ${property.addressDistrict}, ${property.addressCity}` : `${property.addressWard}, ${property.addressDistrict}, ${property.addressCity}`
                };

                const response = await predictPropertyPrice(requestData);
                setEstimationData(response.data);
            } catch (error) {
                console.error("Error fetching estimation:", error);
                setEstimationError(true);
            } finally {
                setIsEstimationLoading(false);
            }
        };

        fetchEstimation();
    }, [property]);

    // Handle Approve
    const handleApprove = () => {
        // Check if listing price is more than 15% higher than predicted price
        if (estimationData?.predicted_price_billions && property) {
            const predictedPriceVND = estimationData.predicted_price_billions * 1000000000;
            const listingPriceVND = property.price;
            const priceDifferencePercent = ((listingPriceVND - predictedPriceVND) / predictedPriceVND) * 100;

            if (priceDifferencePercent > 15) {
                // Show warning dialog first
                setPriceWarningDialogOpen(true);
                return;
            }
        }

        // If no warning needed, show approve dialog directly
        setApproveDialogOpen(true);
    };

    const handlePriceWarningConfirm = () => {
        // User acknowledged the warning, proceed to approve dialog
        setPriceWarningDialogOpen(false);
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
                                {property.addressStreet ? property.addressStreet + ", ": ""}{property.addressWard}, {property.addressDistrict}, {property.addressCity}
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
                                    disabled={isEstimationLoading}
                                >
                                    <Check className="w-4 h-4 mr-2" />
                                    Duyệt
                                </Button>
                                <Button
                                    onClick={handleReject}
                                    variant="destructive"
                                    className="cursor-pointer hover:bg-red-700 flex-1 sm:flex-none"
                                    disabled={isEstimationLoading}
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Từ chối
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Estimation Section - Show only if PENDING */}
                {property.approvalStatus === "PENDING" && (
                    <>
                        {isEstimationLoading && (
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                                <div className="flex flex-col items-center gap-4 py-8">
                                    <Loader2 className="w-12 h-12 text-[#008DDA] animate-spin" />
                                    <p className="text-gray-600 font-medium">Đang định giá bất động sản...</p>
                                </div>
                            </div>
                        )}

                        {!isEstimationLoading && estimationError && (
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                                <div className="text-center py-8">
                                    <p className="text-gray-600">Không thể tải thông tin định giá</p>
                                    <p className="text-sm text-gray-500 mt-2">Hệ thống định giá tạm thời không khả dụng</p>
                                </div>
                            </div>
                        )}

                        {!isEstimationLoading && !estimationError && estimationData && (
                            <>
                                {/* Estimation Header Card */}
                                <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 border border-gray-200">
                                    <div className="text-center mb-6">
                                        <h2 className="text-2xl sm:text-3xl font-semibold mb-2">ĐỊNH GIÁ TỰ ĐỘNG</h2>
                                        <p className="text-sm text-gray-500">Phân tích từ hệ thống AI</p>
                                    </div>

                                    {/* Price and Livability Score */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                        {/* Estimated Price */}
                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-2 mb-3">
                                                <TrendingUp className="w-5 h-5 text-[#008DDA]" />
                                                <p className="text-sm sm:text-base text-gray-600 font-medium">
                                                    Giá ước tính
                                                </p>
                                            </div>
                                            <p className="text-4xl sm:text-5xl font-bold text-[#008DDA] mb-2">
                                                {estimationData.predicted_price_billions?.toFixed(2) || "N/A"} tỷ VNĐ
                                            </p>
                                            {property.area && estimationData.predicted_price_billions && (
                                                <p className="text-sm text-gray-500">
                                                    ≈ {formatPrice((estimationData.predicted_price_billions * 1000000000) / property.area)}/m²
                                                </p>
                                            )}
                                        </div>

                                        {/* Livability Score */}
                                        <div className="flex flex-col items-center">
                                            <p className="text-sm sm:text-base text-gray-600 font-medium mb-4">
                                                Chỉ số sống
                                            </p>
                                            <CircularProgress
                                                value={Math.round(estimationData.livability_score || 0)}
                                                size={140}
                                                strokeWidth={10}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Component Scores Card */}
                                {estimationData.component_scores && (
                                    <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 border border-gray-200">
                                        <h3 className="text-xl font-semibold mb-6 text-center">Các chỉ số chi tiết</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {[
                                                { key: 'score_safety' as const, label: 'An ninh', icon: Shield, color: '#f97316' },
                                                { key: 'score_healthcare' as const, label: 'Y tế', icon: Heart, color: '#ef4444' },
                                                { key: 'score_education' as const, label: 'Giáo dục', icon: GraduationCap, color: '#8b5cf6' },
                                                { key: 'score_shopping' as const, label: 'Mua sắm', icon: ShoppingBag, color: '#22c55e' },
                                                { key: 'score_transportation' as const, label: 'Giao thông', icon: Car, color: '#eab308' },
                                                { key: 'score_environment' as const, label: 'Môi trường', icon: Leaf, color: '#14b8a6' },
                                                { key: 'score_entertainment' as const, label: 'Giải trí', icon: Music, color: '#ec4899' },
                                                { key: 'flood_impact_score' as const, label: 'Ngập lụt', icon: CloudRain, color: '#6366F1' },
                                                { key: 'accident_impact_score' as const, label: 'Tai nạn', icon: AlertTriangle, color: '#F43F5E' },
                                                { key: 'future_project_score' as const, label: 'Tiềm năng', icon: Milestone, color: '#06B6D4' },
                                            ].map(({ key, label, icon: Icon, color }) => {
                                                const score = estimationData.component_scores?.[key] || 0;
                                                return (
                                                    <div key={key} className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <Icon className="w-5 h-5" style={{ color }} />
                                                                <span className="text-sm font-medium text-gray-700">{label}</span>
                                                            </div>
                                                            <span className="text-sm font-semibold" style={{ color }}>
                                                                {score.toFixed(1)}
                                                            </span>
                                                        </div>
                                                        <Progress
                                                            value={score}
                                                            className="h-2"
                                                            indicatorColor={color}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* AI Insight Card */}
                                {estimationData.ai_insight && (
                                    <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 border border-gray-200">
                                        <h3 className="text-xl font-semibold mb-4">Phân tích chi tiết từ AI</h3>
                                        <div className="prose prose-sm sm:prose max-w-none text-gray-700">
                                            <ReactMarkdown
                                                components={{
                                                    h2: ({ children }) => <h2 className="text-lg font-semibold mt-4 mb-2">{children}</h2>,
                                                    h3: ({ children }) => <h3 className="text-base font-semibold mt-3 mb-2">{children}</h3>,
                                                    p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
                                                    strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                                                    ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                                                    ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                                                    li: ({ children }) => <li className="ml-2">{children}</li>,
                                                }}
                                            >
                                                {estimationData.ai_insight}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}

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

            {/* Price Warning Dialog */}
            <AlertDialog open={priceWarningDialogOpen} onOpenChange={setPriceWarningDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                            </div>
                            <AlertDialogTitle className="text-xl">Cảnh báo giá cao</AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="space-y-3 pt-2">
                            <p className="text-base">
                                Giá tin đăng quá cao so với giá dự đoán từ hệ thống AI.
                            </p>
                            {estimationData?.predicted_price_billions && property && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Giá tin đăng:</span>
                                        <span className="font-semibold text-gray-900">
                                            {formatPrice(property.price)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Giá dự đoán:</span>
                                        <span className="font-semibold text-gray-900">
                                            {estimationData.predicted_price_billions.toFixed(2)} tỷ VNĐ
                                        </span>
                                    </div>
                                    <div className="border-t border-yellow-200 pt-2 mt-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Chênh lệch:</span>
                                            <span className="font-bold text-yellow-600">
                                                +{(((property.price - (estimationData.predicted_price_billions * 1000000000)) / (estimationData.predicted_price_billions * 1000000000)) * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <p className="text-sm text-gray-600 italic">
                                <strong>Lý do:</strong> Giá niêm yết cao hơn đáng kể so với mức giá thị trường được hệ thống đánh giá.
                                Vui lòng xem xét kỹ trước khi duyệt tin đăng này.
                            </p>
                            <p className="text-sm font-medium">
                                Bạn có muốn tiếp tục duyệt tin đăng này không?
                            </p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handlePriceWarningConfirm}
                            className="bg-yellow-600 hover:bg-yellow-700 cursor-pointer"
                        >
                            Tiếp tục duyệt
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

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
                        <AlertDialogCancel className="cursor-pointer">Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleApproveConfirm}
                            className="bg-[#008DDA] hover:bg-[#0077b6] cursor-pointer"
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
                        <AlertDialogCancel className="cursor-pointer">Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleRejectConfirm}
                            className="bg-[#008DDA] hover:bg-[#0077b6] cursor-pointer"
                        >
                            Xác nhận
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

