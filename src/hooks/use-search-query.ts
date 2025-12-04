import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

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

            // Keep value as-is from URL - no automatic conversion
            // Components should handle their own value conversions based on their needs
            result.push({
                key,
                operator,
                value: value,
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

    // Set single filter
    const setFilter = useCallback(
        (key: string, operator: Operator, value: string | number) => {
            setSearchParams((prevParams) => {
                const params = new URLSearchParams(prevParams);
                const fullKey = `${key}_${operator}`;

                if (value === "" || value === null || value === undefined) {
                    params.delete(fullKey);
                } else {
                    // Store value as-is - components handle their own conversions
                    params.set(fullKey, String(value));
                }

                return params;
            });
        },
        [setSearchParams]
    );

    // Set multiple filters at once
    const setMultipleFilters = useCallback(
        (updates: Array<{ key: string; operator: Operator; value: string | number }>, resetPage = false) => {
            setSearchParams((prevParams) => {
                const params = new URLSearchParams(prevParams);

                updates.forEach(({ key, operator, value }) => {
                    const fullKey = `${key}_${operator}`;

                    if (value === "" || value === null || value === undefined) {
                        params.delete(fullKey);
                    } else {
                        // Store value as-is - components handle their own conversions
                        params.set(fullKey, String(value));
                    }
                });

                // Reset page to 1 if requested (atomic operation)
                if (resetPage) {
                    params.set("page", "1");
                }

                return params;
            });
        },
        [setSearchParams]
    );

    const setSort = useCallback(
        (key: string, type: SortType | null) => {
            setSearchParams((prevParams) => {
                const params = new URLSearchParams(prevParams);
                const fullKey = `sort_${key}`;

                if (type === null || type === undefined) {
                    params.delete(fullKey);
                } else {
                    params.set(fullKey, type);
                }

                return params;
            });
        },
        [setSearchParams]
    );

    const setPage = useCallback(
        (pageNumber: number) => {
            setSearchParams((prevParams) => {
                const params = new URLSearchParams(prevParams);

                if (pageNumber <= 0) {
                    params.delete("page");
                } else {
                    params.set("page", String(pageNumber));
                }

                return params;
            });
        },
        [setSearchParams]
    );

    const removeFilter = useCallback(
        (key: string, operator: Operator) => {
            setSearchParams((prevParams) => {
                const params = new URLSearchParams(prevParams);
                params.delete(`${key}_${operator}`);
                return params;
            });
        },
        [setSearchParams]
    );

    const removeSort = useCallback(
        (key: string) => {
            setSearchParams((prevParams) => {
                const params = new URLSearchParams(prevParams);
                params.delete(`sort_${key}`);
                return params;
            });
        },
        [setSearchParams]
    );

    const clearFilters = useCallback(() => {
        setSearchParams((prevParams) => {
            const params = new URLSearchParams(prevParams);

            // Lấy list filters từ prevParams
            const filtersToRemove: string[] = [];
            prevParams.forEach((_, fullKey) => {
                if (!fullKey.startsWith("sort_") && fullKey !== "page") {
                    const parts = fullKey.split("_");
                    if (parts.length >= 2) {
                        filtersToRemove.push(fullKey);
                    }
                }
            });

            filtersToRemove.forEach((key) => params.delete(key));
            return params;
        });
    }, [setSearchParams]);

    const clearSorts = useCallback(() => {
        setSearchParams((prevParams) => {
            const params = new URLSearchParams(prevParams);

            const sortsToRemove: string[] = [];
            prevParams.forEach((_, fullKey) => {
                if (fullKey.startsWith("sort_")) {
                    sortsToRemove.push(fullKey);
                }
            });

            sortsToRemove.forEach((key) => params.delete(key));
            return params;
        });
    }, [setSearchParams]);

    // Set single sort - clears all existing sorts and sets new one (atomic operation)
    const setSingleSort = useCallback(
        (key: string, type: SortType, resetPage = false) => {
            setSearchParams((prevParams) => {
                const params = new URLSearchParams(prevParams);

                // 1. Remove all existing sort params
                const sortsToRemove: string[] = [];
                prevParams.forEach((_, fullKey) => {
                    if (fullKey.startsWith("sort_")) {
                        sortsToRemove.push(fullKey);
                    }
                });
                sortsToRemove.forEach((sortKey) => params.delete(sortKey));

                // 2. Add new sort
                params.set(`sort_${key}`, type);

                // 3. Reset page to 1 if requested (atomic operation)
                if (resetPage) {
                    params.set("page", "1");
                }

                return params;
            });
        },
        [setSearchParams]
    );

    return {
        filters,
        sorts,
        page,
        setFilter,
        setMultipleFilters,
        setSort,
        setSingleSort,
        setPage,
        removeFilter,
        removeSort,
        clearFilters,
        clearSorts,
    };
};