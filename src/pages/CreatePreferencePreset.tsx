import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Shield, Heart, GraduationCap, ShoppingBag, Car, Leaf, Music, Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { createPreferencePreset } from "@/services/preferencePresetServices";

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
        color: 'bg-blue-100 text-blue-600',
        barColor: 'bg-blue-500'
    },
    {
        key: 'preferenceHealthcare',
        label: 'Y tế',
        icon: Heart,
        color: 'bg-red-100 text-red-600',
        barColor: 'bg-red-500'
    },
    {
        key: 'preferenceEducation',
        label: 'Giáo dục',
        icon: GraduationCap,
        color: 'bg-purple-100 text-purple-600',
        barColor: 'bg-purple-500'
    },
    {
        key: 'preferenceShopping',
        label: 'Tiện ích',
        icon: ShoppingBag,
        color: 'bg-green-100 text-green-600',
        barColor: 'bg-green-500'
    },
    {
        key: 'preferenceTransportation',
        label: 'Giao thông',
        icon: Car,
        color: 'bg-yellow-100 text-yellow-600',
        barColor: 'bg-yellow-500'
    },
    {
        key: 'preferenceEnvironment',
        label: 'Môi trường',
        icon: Leaf,
        color: 'bg-teal-100 text-teal-600',
        barColor: 'bg-teal-500'
    },
    {
        key: 'preferenceEntertainment',
        label: 'Giải trí',
        icon: Music,
        color: 'bg-pink-100 text-pink-600',
        barColor: 'bg-pink-500'
    },
];

export default function CreatePreferencePreset() {
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Remove image
    const handleRemoveImage = () => {
        form.setValue('image', null, { shouldValidate: true });
        setImagePreview("");
    };


    // Handle form submit
    const onSubmit = async (data: FormValues) => {
        if (!imagePreview) {
            toast.error("Vui lòng chọn ảnh đại diện");
            return;
        }

        setIsSubmitting(true);
        try {
            // Prepare create data - convert percentages to decimals (0-1 range)
            const createData = {
                name: data.name,
                description: data.description,
                image: "https://s1.media.ngoisao.vn/news/2021/11/07/jack-va-thien-an-5805-tile-ngoisaovn-w1080-h648.jpg",
                preferenceSafety: data.preferenceSafety / 100,
                preferenceHealthcare: data.preferenceHealthcare / 100,
                preferenceEducation: data.preferenceEducation / 100,
                preferenceShopping: data.preferenceShopping / 100,
                preferenceTransportation: data.preferenceTransportation / 100,
                preferenceEnvironment: data.preferenceEnvironment / 100,
                preferenceEntertainment: data.preferenceEntertainment / 100,
            };

            await createPreferencePreset(createData);

            toast.success("Tạo bộ ưu tiên thành công!");
            navigate("/bo-uu-tien");
        } catch (error) {
            console.error("Error creating preference preset:", error);
            toast.error("Có lỗi xảy ra khi tạo bộ ưu tiên");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Tạo bộ ưu tiên mới
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Tạo một bộ ưu tiên mới để phù hợp với nhu cầu tìm kiếm của bạn
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
                                rules={{
                                    required: "Vui lòng chọn ảnh"
                                }}
                                render={({ field: { value, onChange, ...field } }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">
                                            Ảnh đại diện <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <div className="flex flex-col items-center">
                                                {!imagePreview ? (
                                                    <div className="w-full max-w-sm aspect-square border-2 border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center hover:border-gray-400 transition-colors">
                                                        <input
                                                            id="image"
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleImageChange}
                                                            className="hidden"
                                                            {...field}
                                                        />
                                                        <label
                                                            htmlFor="image"
                                                            className="cursor-pointer flex flex-col items-center gap-3 text-center"
                                                        >
                                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                                                <Upload className="w-8 h-8 text-gray-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-700">
                                                                    Nhấn để tải ảnh lên
                                                                </p>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    PNG, JPG, JPEG (tối đa 5MB)
                                                                </p>
                                                            </div>
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <div className="w-full max-w-sm">
                                                        <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                                                            <img
                                                                src={imagePreview}
                                                                alt="Preview"
                                                                className="w-full h-full object-cover"
                                                            />
                                                            <Button
                                                                type="button"
                                                                onClick={handleRemoveImage}
                                                                variant="destructive"
                                                                size="icon-sm"
                                                                className="absolute top-3 right-3"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                                            Đang tạo...
                                        </>
                                    ) : (
                                        "Tạo bộ ưu tiên"
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

