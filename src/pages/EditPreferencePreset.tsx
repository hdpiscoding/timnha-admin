import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form";
import { Shield, Heart, GraduationCap, ShoppingBag, Car, Leaf, Music, Upload, Loader2, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { getPreferencePresetById, updatePreferencePreset, suggestPreferencePreset } from "@/services/preferencePresetServices";
import { uploadImage } from "@/services/mediaServices";
import { Progress } from "@/components/ui/progress";

// Define form values type
interface FormValues {
    name: string;
    description: string;
    image: File | null;
    preferenceSafety: number;
    preferenceHealthcare: number;
    preferenceEducation: number;
    preferenceShopping: number;
    preferenceTransportation: number;
    preferenceEnvironment: number;
    preferenceEntertainment: number;
}

interface PreferenceItem {
    key: string;
    label: string;
    icon: typeof Shield;
    color: string;
    barColor: string;
}

const preferenceConfig: PreferenceItem[] = [
    {
        key: 'preferenceSafety',
        label: 'An ninh',
        icon: Shield,
        color: 'bg-orange-100 text-orange-500',
        barColor: '#3b82f6'
    },
    {
        key: 'preferenceHealthcare',
        label: 'Y tế',
        icon: Heart,
        color: 'bg-red-100 text-red-500',
        barColor: '#ef4444'
    },
    {
        key: 'preferenceEducation',
        label: 'Giáo dục',
        icon: GraduationCap,
        color: 'bg-purple-100 text-purple-500',
        barColor: '#a855f7'
    },
    {
        key: 'preferenceShopping',
        label: 'Mua sắm',
        icon: ShoppingBag,
        color: 'bg-green-100 text-green-500',
        barColor: '#22c55e'
    },
    {
        key: 'preferenceTransportation',
        label: 'Giao thông',
        icon: Car,
        color: 'bg-yellow-100 text-yellow-500',
        barColor: '#eab308'
    },
    {
        key: 'preferenceEnvironment',
        label: 'Môi trường',
        icon: Leaf,
        color: 'bg-teal-100 text-teal-500',
        barColor: '#14b8a6'
    },
    {
        key: 'preferenceEntertainment',
        label: 'Giải trí',
        icon: Music,
        color: 'bg-pink-100 text-pink-500',
        barColor: '#ec4899'
    },
];

export default function EditPreferencePreset() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [imagePreview, setImagePreview] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
    const [suggestionData, setSuggestionData] = useState<{
        sourcePresetName: string;
        totalAdaptations: number;
        avgSafety: number;
        avgEducation: number;
        avgShopping: number;
        avgTransportation: number;
        avgEnvironment: number;
        avgEntertainment: number;
        avgHealthcare: number;
    } | null>(null);

    // Initialize React Hook Form
    const form = useForm<FormValues>({
        mode: "onSubmit",
        defaultValues: {
            name: "",
            description: "",
            image: null,
            preferenceSafety: 50,
            preferenceHealthcare: 50,
            preferenceEducation: 50,
            preferenceShopping: 50,
            preferenceTransportation: 50,
            preferenceEnvironment: 50,
            preferenceEntertainment: 50,
        },
    });

    // Fetch preference preset data
    useEffect(() => {
        const fetchPreferencePreset = async () => {
            if (!id) {
                toast.error("ID không hợp lệ");
                navigate("/bo-uu-tien");
                return;
            }

            setIsLoading(true);
            try {
                const response = await getPreferencePresetById(Number(id));

                // Set form values - multiply by 100 to convert decimal to percentage
                form.reset({
                    name: response.data.name,
                    description: response.data.description,
                    image: null,
                    preferenceSafety: Math.round(response.data.preferenceSafety * 100),
                    preferenceHealthcare: Math.round(response.data.preferenceHealthcare * 100),
                    preferenceEducation: Math.round(response.data.preferenceEducation * 100),
                    preferenceShopping: Math.round(response.data.preferenceShopping * 100),
                    preferenceTransportation: Math.round(response.data.preferenceTransportation * 100),
                    preferenceEnvironment: Math.round(response.data.preferenceEnvironment * 100),
                    preferenceEntertainment: Math.round(response.data.preferenceEntertainment * 100),
                });

                // Set image preview from API
                setImagePreview(response.data.image);

                // Fetch suggestion data
                fetchSuggestion(Number(id));

            } catch (error) {
                console.error("Error fetching preference preset:", error);
                toast.error("Không thể tải dữ liệu bộ ưu tiên");
                navigate("/bo-uu-tien");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPreferencePreset();
    }, [id, navigate, form]);

    // Fetch suggestion data
    const fetchSuggestion = async (presetId: number) => {
        setIsSuggestionLoading(true);
        try {
            const response = await suggestPreferencePreset(presetId);
            setSuggestionData(response.data);
        } catch (error) {
            console.error("Error fetching suggestion:", error);
            // Don't show error toast, just silently fail
        } finally {
            setIsSuggestionLoading(false);
        }
    };

    // Apply suggested preferences
    const applySuggestion = () => {
        if (!suggestionData) return;

        form.setValue('preferenceSafety', Math.round(suggestionData.avgSafety * 100));
        form.setValue('preferenceHealthcare', Math.round(suggestionData.avgHealthcare * 100));
        form.setValue('preferenceEducation', Math.round(suggestionData.avgEducation * 100));
        form.setValue('preferenceShopping', Math.round(suggestionData.avgShopping * 100));
        form.setValue('preferenceTransportation', Math.round(suggestionData.avgTransportation * 100));
        form.setValue('preferenceEnvironment', Math.round(suggestionData.avgEnvironment * 100));
        form.setValue('preferenceEntertainment', Math.round(suggestionData.avgEntertainment * 100));

        toast.success("Đã áp dụng gợi ý thành công!");
    };

    // Handle image upload
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error("Vui lòng chọn file ảnh hợp lệ");
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Kích thước ảnh không được vượt quá 5MB");
                return;
            }

            // Update form value
            form.setValue('image', file, { shouldValidate: true });

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };


    // Handle form submit
    const onSubmit = async (data: FormValues) => {
        if (!id) return;

        if (!imagePreview) {
            toast.error("Vui lòng chọn ảnh đại diện");
            return;
        }

        setIsSubmitting(true);
        try {
            let imageUrl = imagePreview;

            // Step 1: If user selected a new image, upload it
            if (data.image) {
                const uploadResponse = await uploadImage(data.image);
                imageUrl = uploadResponse.data.mediaUrl;
            }

            // Step 2: Prepare update data - convert percentages back to decimals (0-1 range)
            const updateData = {
                name: data.name,
                description: data.description,
                image: imageUrl,
                preferenceSafety: data.preferenceSafety / 100,
                preferenceHealthcare: data.preferenceHealthcare / 100,
                preferenceEducation: data.preferenceEducation / 100,
                preferenceShopping: data.preferenceShopping / 100,
                preferenceTransportation: data.preferenceTransportation / 100,
                preferenceEnvironment: data.preferenceEnvironment / 100,
                preferenceEntertainment: data.preferenceEntertainment / 100,
            };

            // Step 3: Update preference preset
            await updatePreferencePreset(Number(id), updateData);

            toast.success("Cập nhật bộ ưu tiên thành công!");
            navigate("/bo-uu-tien");
        } catch (error) {
            console.error("Error updating preference preset:", error);
            toast.error("Có lỗi xảy ra khi cập nhật bộ ưu tiên");
        } finally {
            setIsSubmitting(false);
        }
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

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Chỉnh sửa bộ ưu tiên
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Cập nhật thông tin và độ ưu tiên cho bộ ưu tiên
                    </p>
                </div>

                {/* Form */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Basic Information */}
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Thông tin cơ bản
                            </h2>

                            {/* Name Input */}
                            <FormField
                                control={form.control}
                                name="name"
                                rules={{
                                    required: "Tên bộ ưu tiên không được để trống",
                                    maxLength: {
                                        value: 100,
                                        message: "Tên không được quá 100 ký tự"
                                    }
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">
                                            Tên bộ ưu tiên <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ví dụ: Gia đình trẻ, Người đi làm, Sinh viên..."
                                                {...field}
                                                maxLength={100}
                                                className="focus-visible:ring-[#008DDA]"
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs text-gray-500">
                                            {field.value?.length}/100 ký tự
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Description Textarea */}
                            <FormField
                                control={form.control}
                                name="description"
                                rules={{
                                    required: "Mô tả không được để trống",
                                    maxLength: {
                                        value: 500,
                                        message: "Mô tả không được quá 500 ký tự"
                                    }
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">
                                            Mô tả <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Mô tả chi tiết về bộ ưu tiên này..."
                                                {...field}
                                                className="min-h-[120px] resize-none focus-visible:ring-[#008DDA]"
                                                maxLength={500}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs text-gray-500">
                                            {field.value?.length}/500 ký tự
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Image Upload */}
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">
                                            Ảnh đại diện <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <div className="flex flex-col items-center space-y-4">
                                                {imagePreview ? (
                                                    <div className="w-full max-w-sm aspect-square rounded-lg overflow-hidden border border-gray-200">
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-full max-w-sm aspect-square border-2 border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center hover:border-gray-400 transition-colors">
                                                        <div className="flex flex-col items-center gap-3 text-center">
                                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                                                <Upload className="w-8 h-8 text-gray-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-700">
                                                                    Chưa có ảnh
                                                                </p>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    Vui lòng tải ảnh lên
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Change Image Button */}
                                                <div className="text-center">
                                                    <input
                                                        id="image-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        className="hidden"
                                                        ref={field.ref}
                                                        name={field.name}
                                                        onBlur={field.onBlur}
                                                    />
                                                    <label
                                                        htmlFor="image-upload"
                                                        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors"
                                                    >
                                                        <Upload className="w-4 h-4" />
                                                        {imagePreview ? "Thay đổi ảnh" : "Tải ảnh lên"}
                                                    </label>
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        PNG, JPG, JPEG (tối đa 5MB)
                                                    </p>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Suggestion Section */}
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                        <Lightbulb className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            Gợi ý chỉnh sửa độ ưu tiên
                                        </h2>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Dựa trên hành vi của người dùng với bộ ưu tiên này
                                        </p>
                                    </div>
                                </div>
                                {suggestionData && !isSuggestionLoading && (
                                    <Button
                                        type="button"
                                        onClick={applySuggestion}
                                        className="bg-amber-500 hover:bg-amber-600 text-white cursor-pointer"
                                    >
                                        <Lightbulb className="w-4 h-4 mr-2" />
                                        Áp dụng gợi ý
                                    </Button>
                                )}
                            </div>

                            {isSuggestionLoading ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-3" />
                                    <p className="text-gray-600 text-sm">Đang tải gợi ý...</p>
                                </div>
                            ) : suggestionData ? (
                                <div className="space-y-6">
                                    {/* Suggestion Info */}
                                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Nguồn gợi ý</p>
                                                <p className="text-base font-semibold text-gray-900">
                                                    {suggestionData.sourcePresetName}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Số lần điều chỉnh</p>
                                                <p className="text-base font-semibold text-gray-900">
                                                    {suggestionData.totalAdaptations} lần
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Suggested Preferences */}
                                    <div className="space-y-5">
                                        {preferenceConfig.map((config) => {
                                            const Icon = config.icon;
                                            const key = config.key.replace('preference', 'avg');
                                            const suggestionKey = key.charAt(0).toLowerCase() + key.slice(1) as keyof typeof suggestionData;
                                            const value = Math.round((suggestionData[suggestionKey] as number) * 100);

                                            return (
                                                <div key={config.key} className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className={cn(
                                                                "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                                                                config.color
                                                            )}>
                                                                <Icon className="w-4 h-4" />
                                                            </div>
                                                            <span className="text-sm font-medium text-gray-700">
                                                                {config.label}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-lg font-bold text-gray-900 min-w-[50px] text-right">
                                                                {value}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                / 100
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Progress
                                                        value={value}
                                                        className="h-2"
                                                        indicatorColor={config.barColor}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                        <Lightbulb className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-600 text-sm">
                                        Không có gợi ý nào cho bộ ưu tiên này
                                    </p>
                                    <p className="text-gray-500 text-xs mt-1">
                                        Gợi ý sẽ được tạo khi có người dùng điều chỉnh bộ ưu tiên
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Preferences */}
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Thiết lập độ ưu tiên
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Điều chỉnh mức độ quan trọng cho mỗi yếu tố (0-100)
                                </p>
                            </div>

                            <div className="space-y-8">
                                {preferenceConfig.map((config) => {
                                    const Icon = config.icon;

                                    return (
                                        <FormField
                                            key={config.key}
                                            control={form.control}
                                            name={config.key as keyof FormValues}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className="space-y-3">
                                                        {/* Label and Value */}
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className={cn(
                                                                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                                                                    config.color
                                                                )}>
                                                                    <Icon className="w-5 h-5" />
                                                                </div>
                                                                <span className="text-base font-medium text-gray-700">
                                                                    {config.label}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-2xl font-bold text-gray-900 min-w-[60px] text-right">
                                                                    {field.value as number}
                                                                </span>
                                                                <span className="text-sm text-gray-500">
                                                                    / 100
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Slider */}
                                                        <FormControl>
                                                            <div className="px-1">
                                                                <Slider
                                                                    value={[field.value as number]}
                                                                    onValueChange={(value) => field.onChange(value[0])}
                                                                    min={0}
                                                                    max={100}
                                                                    step={1}
                                                                    className="w-full"
                                                                />
                                                            </div>
                                                        </FormControl>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    );
                                })}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                            <div className="flex items-center justify-center lg:justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate("/bo-uu-tien")}
                                    disabled={isSubmitting}
                                    className="min-w-[150px] cursor-pointer"
                                >
                                    Hủy bỏ
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="min-w-[150px] cursor-pointer bg-[#008DDA] hover:bg-[#0077b6]"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Đang cập nhật...
                                        </>
                                    ) : (
                                        "Cập nhật"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}

