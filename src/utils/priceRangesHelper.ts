import {PRICE_RANGES} from '@/constants/priceRanges';

/**
 * Lấy giá trị min-max dưới dạng string "min-max"
 * @param id - ID của price range
 * @returns "min-max" hoặc undefined nếu không hợp lệ
 */
export function getPriceRangeValue(id: string): string | undefined {
    const range = PRICE_RANGES.find(r => r.id === id);
    if (!range) return undefined;

    const min = range.min;
    // Nếu max = null nghĩa là không giới hạn → đặt số rất lớn
    const max = range.max ?? 999_999_999_999;

    return `${min}-${max}`;
}

/**
 * Lấy ID của price range dựa trên min-max
 * @param value - Chuỗi "min-max"
 * @returns ID của price range hoặc undefined nếu không hợp lệ
 */
export function getPriceRangeId(value: string): string | undefined {
    const [minStr, maxStr] = value.split('-');
    const min = Number(minStr);
    const max = Number(maxStr);

    const range = PRICE_RANGES.find(r => {
        const rMin = r.min;
        const rMax = r.max ?? 999_999_999_999;
        return rMin === min && rMax === max;
    });

    return range?.id;
}

/**
 * Kiểm tra ID của price range có hợp lệ hay không
 * @param id - ID cần kiểm tra
 * @returns true nếu hợp lệ
 */
export function isValidPriceRangeId(id: string): boolean {
    return PRICE_RANGES.some(r => r.id === id);
}