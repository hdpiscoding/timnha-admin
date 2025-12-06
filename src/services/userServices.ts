import {instance} from "@/config/axiosConfig.ts";

interface FilterParams {
    key: string;
    operator: string;
    value: string;
}

interface SortParams {
    key: string;
    type: string;
}

export const approveSellerRequest = async (status: string, rejectReason: string = "", userId: number) => {
    const response = await instance.post(`user/${userId}/review-seller`, {status, rejectReason});
    return response.data;
}

export const searchUsers = async (query: {
    filters?: FilterParams[],
    sorts?: SortParams[],
    rpp: number,
    page: number
}) => {
    const response = await instance.post("user/search", {
        filters: query.filters,
        sorts: query.sorts,
        rpp: query.rpp,
        page: query.page
    });
    return response.data;
}

export const getUserById = async (id: number) => {
    const response = await instance.get(`user/${id}`);
    return response.data;
}