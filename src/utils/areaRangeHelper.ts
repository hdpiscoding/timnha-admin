import { AREA_RANGES } from '@/constants/areaRanges';

/**
 * Lấy giá trị min-max dưới dạng string "min-max"
 * @param id - ID của area range
 * @returns "min-max" hoặc undefined nếu không hợp lệ
 */
export function getAreaRangeValue(id: string): string | undefined {
    const range = AREA_RANGES.find(r => r.id === id);
    if (!range) return undefined;

    const min = range.min;
    // Nếu max = null nghĩa là không giới hạn → đặt số rất lớn
    const max = range.max ?? 999_999_999;

    return `${min}-${max}`;
}

/**
 * Lấy ID của area range dựa trên min-max
 * @param value - Chuỗi "min-max"
 * @returns ID của area range hoặc undefined nếu không hợp lệ
 */
export function getAreaRangeId(value: string): string | undefined {
    const [minStr, maxStr] = value.split('-');
    const min = Number(minStr);
    const max = Number(maxStr);

    const range = AREA_RANGES.find(r => {
        const rMin = r.min;
        const rMax = r.max ?? 999_999_999;
        return rMin === min && rMax === max;
    });

    return range?.id;
}

/**
 * Kiểm tra ID của area range có hợp lệ hay không
 * @param id - ID cần kiểm tra
 * @returns true nếu hợp lệ
 */
export function isValidAreaRangeId(id: string): boolean {
    return AREA_RANGES.some(r => r.id === id);
}
