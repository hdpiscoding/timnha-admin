import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getDistrictNameById, getDistrictIdByName } from "@/utils/districtHelper";
import { getPriceRangeValue, getPriceRangeId } from "@/utils/priceRangesHelper";

export type Operator = "eq" | "gt" | "lt" | "gte" | "lte" | "lk" | "rng";
export type SortType = "ASC" | "DESC";

export interface FilterItem {
    key: string;
    operator: Operator;
    value: string;
}

export interface SortItem {
    key: string;
    type: SortType;
}

export const useSearchQuery = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Parse URL → FilterItem[]
    const filters = useMemo<FilterItem[]>(() => {
        const result: FilterItem[] = [];

        searchParams.forEach((value, fullKey) => {
            // Skip sort và page params
            if (fullKey.startsWith("sort_") || fullKey === "page") return;

            const parts = fullKey.split("_");
            if (parts.length < 2) return;

            const operator = parts.pop() as Operator;
            const key = parts.join("_");

            let finalValue = value;
            if (key === "addressDistrict") {
                const districtName = getDistrictNameById(value);
                if (districtName) {
                    finalValue = districtName;
                }
            }

            if (key === "price" && operator === "rng") {
                const priceRange = getPriceRangeValue(value);
                if (priceRange) {
                    finalValue = priceRange;
                }
            }

            result.push({
                key,
                operator,
                value: finalValue,
            });
        });

        return result;
    }, [searchParams]);

    // Parse URL → SortItem[]
    const sorts = useMemo<SortItem[]>(() => {
        const result: SortItem[] = [];

        searchParams.forEach((value, fullKey) => {
            if (!fullKey.startsWith("sort_")) return;

            // format: sort_createdAt=DESC
            const key = fullKey.replace("sort_", "");
            const type = value.toUpperCase() as SortType;

            if (type === "ASC" || type === "DESC") {
                result.push({ key, type });
            }
        });

        return result;
    }, [searchParams]);

    // Parse URL → page number
    const page = useMemo<number>(() => {
        const pageParam = searchParams.get("page");
        return pageParam ? parseInt(pageParam, 10) : 1;
    }, [searchParams]);

    // Set filter
    const setFilter = useCallback(
        (key: string, operator: Operator, value: string | number) => {
            const params = new URLSearchParams(searchParams);
            const fullKey = `${key}_${operator}`;

            if (value === "" || value === null || value === undefined) {
                params.delete(fullKey);
            } else {
                let finalValue = String(value);
                if (key === "addressDistrict") {
                    const districtId = getDistrictIdByName(String(value));
                    if (districtId) {
                        finalValue = districtId;
                    }
                }

                if (key === "price" && operator === "rng") {
                    const priceRangeId = getPriceRangeId(String(value));
                    if (priceRangeId) {
                        finalValue = priceRangeId;
                    }
                }

                params.set(fullKey, finalValue);
            }

            setSearchParams(params);
        },
        [searchParams, setSearchParams]
    );

    // Set sort
    const setSort = useCallback(
        (key: string, type: SortType | null) => {
            const params = new URLSearchParams(searchParams);
            const fullKey = `sort_${key}`;

            if (type === null || type === undefined) {
                params.delete(fullKey);
            } else {
                params.set(fullKey, type);
            }

            setSearchParams(params);
        },
        [searchParams, setSearchParams]
    );

    // Remove sort
    const removeSort = useCallback(
        (key: string) => {
            const params = new URLSearchParams(searchParams);
            params.delete(`sort_${key}`);
            setSearchParams(params);
        },
        [searchParams, setSearchParams]
    );

    // Clear all sorts
    const clearSorts = useCallback(() => {
        const params = new URLSearchParams(searchParams);

        sorts.forEach((s) => {
            params.delete(`sort_${s.key}`);
        });

        setSearchParams(params);
    }, [searchParams, sorts, setSearchParams]);

    // Set page
    const setPage = useCallback(
        (pageNumber: number) => {
            const params = new URLSearchParams(searchParams);

            if (pageNumber <= 0) {
                params.delete("page");
            } else {
                params.set("page", String(pageNumber));
            }

            setSearchParams(params);
        },
        [searchParams, setSearchParams]
    );

    // Remove filter
    const removeFilter = useCallback(
        (key: string, operator: Operator) => {
            const params = new URLSearchParams(searchParams);
            params.delete(`${key}_${operator}`);
            setSearchParams(params);
        },
        [searchParams, setSearchParams]
    );

    // Clear all filters
    const clearFilters = useCallback(() => {
        const params = new URLSearchParams(searchParams);

        filters.forEach((f) => {
            params.delete(`${f.key}_${f.operator}`);
        });

        setSearchParams(params);
    }, [searchParams, filters, setSearchParams]);

    return {
        filters,
        sorts,
        page,
        setFilter,
        setSort,
        setPage,
        removeFilter,
        removeSort,
        clearFilters,
        clearSorts,
    };
};