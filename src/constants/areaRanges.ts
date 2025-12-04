interface AreaRange {
    id: string;
    title: string;
    min: number;
    max: number | null;
}

export const AREA_RANGES: AreaRange[] = [
    { id: 'duoi-30m2', title: 'Dưới 30m²', min: 0, max: 30 },
    { id: '30-50m2', title: '30 - 50m²', min: 30, max: 50 },
    { id: '50-80m2', title: '50 - 80m²', min: 50, max: 80 },
    { id: '80-100m2', title: '80 - 100m²', min: 80, max: 100 },
    { id: '100-150m2', title: '100 - 150m²', min: 100, max: 150 },
    { id: '150-200m2', title: '150 - 200m²', min: 150, max: 200 },
    { id: '200-300m2', title: '200 - 300m²', min: 200, max: 300 },
    { id: '300-400m2', title: '300 - 400m²', min: 300, max: 400 },
    { id: 'tren-400m2', title: 'Trên 400m²', min: 400, max: null },
];
