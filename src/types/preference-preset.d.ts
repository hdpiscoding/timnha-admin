export interface PreferencePreset {
    id: number;
    name: string;
    image: string;
    createAt?: string;
    description: string;
    preferenceSafety: number;
    preferenceHealthcare: number;
    preferenceEducation: number;
    preferenceShopping: number;
    preferenceTransportation: number;
    preferenceEnvironment: number;
    preferenceEntertainment: number;
}