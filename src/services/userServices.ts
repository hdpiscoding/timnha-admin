import {instance} from "@/config/axiosConfig.ts";

export const approveSellerRequest = async (status: string, rejectReason: string, userId: number) => {
    const response = await instance.post(`user/${userId}/review-seller`, {status, rejectReason});
    return response.data;
}