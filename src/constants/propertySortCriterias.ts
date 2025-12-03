interface PropertySortCriteria {
    id: string;
    title: string;
}

export const PROPERTY_SORT_CRITERIAS: PropertySortCriteria[] = [
    {id: "price_ASC", title: "Giá: Thấp đến cao"},
    {id: "price_DESC", title: "Giá: Cao đến thấp"},
    {id: "area_ASC", title: "Diện tích: Nhỏ đến lớn"},
    {id: "area_DESC", title: "Diện tích: Lớn đến nhỏ"},
]