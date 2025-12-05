import type {SellerApproveStatus} from "@/types/seller-approve-status";

export const SELLER_APPROVE_STATUSES: SellerApproveStatus[] = [
    { id: 'NONE', name: 'Chưa gửi duyệt' },
    { id: 'PENDING', name: 'Chờ duyệt' },
    { id: 'APPROVED', name: 'Đã duyệt' },
    { id: 'REJECTED', name: 'Từ chối' },
];