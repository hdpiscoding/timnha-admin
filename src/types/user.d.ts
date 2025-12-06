export interface User {
    id: string;
    fullName: string;
    phoneNumber: string;
    avatarUrl: string | null;
    liveAddress: string | null;
    preferenceType: string | null;
    updateAt: string;
    becomeSellerApproveStatus: string;
    preferenceSafety: number | null;
    preferenceHealthcare: number | null;
    preferenceEducation: number | null;
    preferenceShopping: number | null;
    preferenceTransportation: number | null;
    preferenceEnvironment: number | null;
    preferenceEntertainment: number | null;
}