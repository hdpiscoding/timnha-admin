import {instance} from "@/config/axiosConfig.ts";

export const getAllPreferencePresets = async () => {
    const response = await instance.get("user/preference-presets");
    return response.data;
}

export const getPreferencePresetById = async (id: number) => {
    const response = await instance.get(`user/preference-presets/${id}`);
    return response.data;
}

export const createPreferencePreset = async (data: {
    name: string,
    image: string,
    description: string,
    preferenceSafety: number,
    preferenceHealthcare: number,
    preferenceEducation: number,
    preferenceShopping: number,
    preferenceTransportation: number,
    preferenceEnvironment: number,
    preferenceEntertainment: number
}) => {
    const response = await instance.post("user/admin/preference-presets", data);
    return response.data;
}

export const updatePreferencePreset = async (id: number, data: {
    name: string,
    image: string,
    description: string,
    preferenceSafety: number,
    preferenceHealthcare: number,
    preferenceEducation: number,
    preferenceShopping: number,
    preferenceTransportation: number,
    preferenceEnvironment: number,
    preferenceEntertainment: number
})=> {
    const response = await instance.put(`user/admin/preference-presets/${id}`, data);
    return response.data;
}

export const deletePreferencePreset = async (id: number) => {
    const response = await instance.delete(`user/admin/preference-presets/${id}`);
    return response.data;
}

export const suggestPreferencePreset = async (presetId: number) => {
    const response = await instance.get(`user/preference-presets/suggestion/${presetId}`);
    return response.data;
}