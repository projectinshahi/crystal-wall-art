import SubcategoryList from '@/components/SubcategoryList';
import { notFound, redirect } from 'next/navigation';

// Clicking a main category lands here: its subcategories (each links to its products)
const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const base = process.env.NEXT_PUBLIC_URL;

    const categoryRes = await fetch(`${base}/api/category/${id}`).then((r) => r.json()).catch(() => null);
    const category = categoryRes?.success ? categoryRes.data : null;

    if (!category?.id) notFound();

    // A subcategory has no subcategories of its own: show its products
    if (category.parent_id) redirect(`/products?category=${id}`);

    const [subRes, productsRes] = await Promise.all([
        fetch(`${base}/api/category?parent=${id}`).then((r) => r.json()).catch(() => null),
        // Products still attached directly to the main category (added before subcategories existed)
        fetch(`${base}/api/products/${id}/category`).then((r) => r.json()).catch(() => null),
    ]);

    return (
        <SubcategoryList
            title={category.title}
            subcategories={subRes?.success ? subRes.data : []}
            products={productsRes?.success ? productsRes.data : []}
        />
    );
};

export default Page;
