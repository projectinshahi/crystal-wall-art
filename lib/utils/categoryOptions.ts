import { CategoryTypes } from "@/types/Admin/categories.types";

// "Main › Sub" for a subcategory, plain title for a main category
export function categoryLabel(category: CategoryTypes, all: CategoryTypes[]): string {
    if (!category.parent_id) return category.title;
    const parent = all.find((c) => c.id === category.parent_id);
    return parent ? `${parent.title} › ${category.title}` : category.title;
}

// Select options for assigning a product: subcategories only
export function subcategoryOptions(all: CategoryTypes[]) {
    return all
        .filter((c) => c.parent_id)
        .map((c) => ({ label: categoryLabel(c, all), value: c.id }))
        .sort((a, b) => a.label.localeCompare(b.label));
}

// Filter options: each main category followed by its subcategories
export function categoryTreeOptions(all: CategoryTypes[]) {
    return all
        .filter((c) => !c.parent_id)
        .flatMap((main) => [
            { label: main.title, value: main.id },
            ...all
                .filter((c) => c.parent_id === main.id)
                .map((sub) => ({ label: `${main.title} › ${sub.title}`, value: sub.id })),
        ]);
}
