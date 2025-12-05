import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/input-password";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {Spinner} from "@/components/ui/spinner.tsx";
import {login} from "@/services/authServices.ts";
import {useUserStore} from "@/stores/userStore.ts";
import {toast} from "react-toastify";

export default function Login() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const loginData = useUserStore((state) => state.login);

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onSubmit",
    });

    const onSubmit = async (data: { email: string; password: string }) => {
        setIsLoading(true);
        try {
            const response = await login(data.email, data.password);
            if (response.status === "200") {
                loginData(response.data.token);
                toast.success("Đăng nhập thành công!");
                navigate("/bang-dieu-khien");
            }
        } catch (error) {
            toast.error("Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.");
            console.error("Error logging in:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full">
            {/* Left side - 30% - Hidden on mobile */}
            <div className="hidden lg:flex lg:w-[30%] bg-white flex-col items-center justify-center p-8">
                <div className="text-center space-y-6">
                    <img
                        src="/src/assets/timnha-portrait.png"
                        alt="TimNha Logo"
                        className="w-48 h-auto mx-auto"
                    />
                    <div className="text-gray-600">
                        <h1 className="text-3xl font-bold mb-2">Trang Quản Trị</h1>
                        <p className="text-lg text-gray-400">
                            Quản lý nền tảng bất động sản
                        </p>
                    </div>
                </div>
            </div>

            {/* Right side - 70% - Full width on mobile */}
            <div className="w-full lg:w-[70%] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="text-center text-3xl font-bold text-gray-900">
                            Đăng nhập Admin
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Vui lòng đăng nhập để truy cập trang quản trị
                        </p>
                    </div>

                    <div className="bg-white py-8 px-6 shadow rounded-lg">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    rules={{
                                        required: "Email không được để trống!",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Email không hợp lệ!",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Nhập email"
                                                    type="email"
                                                    autoComplete="email"
                                                    className="focus-visible:ring-[#008DDA] focus-visible:border-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    rules={{
                                        required: "Mật khẩu không được để trống!",
                                    }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mật khẩu</FormLabel>
                                            <FormControl>
                                                <PasswordInput
                                                    placeholder="Nhập mật khẩu"
                                                    autoComplete="current-password"
                                                    className="focus-visible:ring-[#008DDA] focus-visible:border-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className={`w-full transition-colors duration-200 ${isLoading ? "bg-[#0064A6]" : "bg-[#008DDA] cursor-pointer"} hover:bg-[#0064A6] `}
                                >
                                    {isLoading ? <Spinner/> : null}
                                    Đăng nhập
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}

