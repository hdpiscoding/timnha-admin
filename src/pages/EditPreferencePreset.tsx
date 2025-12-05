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
import { Shield, Heart, GraduationCap, ShoppingBag, Car, Leaf, Music, Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import type {PreferencePreset} from "@/types/preference-preset";

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

export default function EditPreferencePreset() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [imagePreview, setImagePreview] = useState<string>("");
    const [existingImageUrl, setExistingImageUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [imageChanged, setImageChanged] = useState(false);

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
                navigate("/preference-presets");
                return;
            }

            setIsLoading(true);
            try {
                // TODO: Call API to get preference preset by ID
                // const response = await getPreferencePresetById(id);
                // const data: PreferencePresetData = response.data;

                // Mock data
                await new Promise(resolve => setTimeout(resolve, 500));
                const data: PreferencePreset = {
                    id: 11,
                    name: "Tín đồ Thể thao & Cộng đồng",
                    image: "🏃‍♂️",
                    description: "Ưu tiên các tiện ích thể thao (gym, sân), công viên và các hoạt động văn hóa.",
                    createAt: "2025-11-03T15:40:08.325218Z",
                    preferenceSafety: 0.40,
                    preferenceEducation: 0.20,
                    preferenceShopping: 0.50,
                    preferenceTransportation: 0.50,
                    preferenceEnvironment: 1.00,
                    preferenceEntertainment: 0.90,
                    preferenceHealthcare: 0.70
                };

                // Set form values - multiply by 100 to convert decimal to percentage
                form.reset({
                    name: data.name,
                    description: data.description,
                    image: null,
                    preferenceSafety: Math.round(data.preferenceSafety * 100),
                    preferenceHealthcare: Math.round(data.preferenceHealthcare * 100),
                    preferenceEducation: Math.round(data.preferenceEducation * 100),
                    preferenceShopping: Math.round(data.preferenceShopping * 100),
                    preferenceTransportation: Math.round(data.preferenceTransportation * 100),
                    preferenceEnvironment: Math.round(data.preferenceEnvironment * 100),
                    preferenceEntertainment: Math.round(data.preferenceEntertainment * 100),
                });

                // Set existing image
                setExistingImageUrl(data.image);

            } catch (error) {
                console.error("Error fetching preference preset:", error);
                toast.error("Không thể tải dữ liệu bộ ưu tiên");
                navigate("/preference-presets");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPreferencePreset();
    }, [id, navigate, form]);

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
            setImageChanged(true);

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
        setImageChanged(true);
    };

    // Handle form submit
    const onSubmit = async (data: FormValues) => {
        try {
            // TODO: Call API to update preference preset
            // const formData = new FormData();
            // formData.append('name', data.name);
            // formData.append('description', data.description);
            // if (imageChanged && data.image) {
            //     formData.append('image', data.image);
            // }
            // // Divide by 100 to convert percentage back to decimal
            // formData.append('preferenceSafety', (data.preferenceSafety / 100).toString());
            // formData.append('preferenceHealthcare', (data.preferenceHealthcare / 100).toString());
            // formData.append('preferenceEducation', (data.preferenceEducation / 100).toString());
            // formData.append('preferenceShopping', (data.preferenceShopping / 100).toString());
            // formData.append('preferenceTransportation', (data.preferenceTransportation / 100).toString());
            // formData.append('preferenceEnvironment', (data.preferenceEnvironment / 100).toString());
            // formData.append('preferenceEntertainment', (data.preferenceEntertainment / 100).toString());
            // await updatePreferencePreset(id, formData);

            // Mock success
            console.log("Form data:", data);
            console.log("Image changed:", imageChanged);
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success("Cập nhật bộ ưu tiên thành công!");
            navigate("/preference-presets");
        } catch (error) {
            console.error("Error updating preference preset:", error);
            toast.error("Có lỗi xảy ra khi cập nhật bộ ưu tiên");
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
                                            Ảnh đại diện
                                        </FormLabel>
                                        <FormControl>
                                            <div>
                                                {!imagePreview && !existingImageUrl ? (
                                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                                                        <input
                                                            id="image"
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleImageChange}
                                                            className="hidden"
                                                            ref={field.ref}
                                                            name={field.name}
                                                            onBlur={field.onBlur}
                                                        />
                                                        <label
                                                            htmlFor="image"
                                                            className="cursor-pointer flex flex-col items-center gap-3"
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
                                                    <div className="space-y-3">
                                                        <div className="relative rounded-lg overflow-hidden border border-gray-200">
                                                            {imagePreview ? (
                                                                <img
                                                                    src={imagePreview}
                                                                    alt="Preview"
                                                                    className="w-full h-64 object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-64 flex items-center justify-center bg-gray-50">
                                                                    <span className="text-8xl">{existingImageUrl}</span>
                                                                </div>
                                                            )}
                                                            <Button
                                                                type="button"
                                                                onClick={handleRemoveImage}
                                                                variant="destructive"
                                                                size="sm"
                                                                className="absolute top-3 right-3"
                                                            >
                                                                <X className="w-4 h-4 mr-1" />
                                                                Xóa
                                                            </Button>
                                                        </div>
                                                        {!imageChanged && existingImageUrl && (
                                                            <div>
                                                                <input
                                                                    id="image-change"
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={handleImageChange}
                                                                    className="hidden"
                                                                    ref={field.ref}
                                                                    name={field.name}
                                                                    onBlur={field.onBlur}
                                                                />
                                                                <label
                                                                    htmlFor="image-change"
                                                                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors"
                                                                >
                                                                    <Upload className="w-4 h-4" />
                                                                    Thay đổi ảnh
                                                                </label>
                                                            </div>
                                                        )}
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
                                    onClick={() => navigate("/preference-presets")}
                                    disabled={form.formState.isSubmitting}
                                    className="min-w-[150px] cursor-pointer"
                                >
                                    Hủy bỏ
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={form.formState.isSubmitting}
                                    className="min-w-[150px] cursor-pointer bg-[#008DDA] hover:bg-[#0077b6]"
                                >
                                    {form.formState.isSubmitting ? (
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

