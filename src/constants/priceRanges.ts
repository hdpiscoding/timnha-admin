interface PriceRange {
    id: string;
    title: string;
    min: number;
    max: number | null;
}
export const PRICE_RANGES: PriceRange[] = [
    { id: 'duoi-500-trieu', title: 'Dưới 500 triệu', min: 0, max: 500_000_000 },
    { id: '500-trieu-den-1-ty', title: '500 triệu - 1 tỷ', min: 500_000_000, max: 1_000_000_000 },
    { id: '1-ty-den-3-ty', title: '1 tỷ - 3 tỷ', min: 1_000_000_000, max: 3_000_000_000 },
    { id: '3-ty-den-5-ty', title: '3 tỷ - 5 tỷ', min: 3_000_000_000, max: 5_000_000_000 },
    { id: '5-ty-den-7-ty', title: '5 tỷ - 7 tỷ', min: 5_000_000_000, max: 7_000_000_000 },
    { id: '7-ty-den-10-ty', title: '7 tỷ - 10 tỷ', min: 7_000_000_000, max: 10_000_000_000 },
    { id: '10-ty-den-15-ty', title: '10 tỷ - 15 tỷ', min: 10_000_000_000, max: 15_000_000_000 },
    { id: '15-ty-den-20-ty', title: '15 tỷ - 20 tỷ', min: 15_000_000_000, max: 20_000_000_000 },
    { id: '20-ty-den-30-ty', title: '20 tỷ - 30 tỷ', min: 20_000_000_000, max: 30_000_000_000 },
    { id: '30-ty-den-40-ty', title: '30 tỷ - 40 tỷ', min: 30_000_000_000, max: 40_000_000_000 },
    { id: '40-ty-den-60-ty', title: '40 tỷ - 60 tỷ', min: 40_000_000_000, max: 60_000_000_000 },
    { id: 'tren-60-ty', title: 'Trên 60 tỷ', min: 60_000_000_000, max: null },
];