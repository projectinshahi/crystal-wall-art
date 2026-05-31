import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { AdminProductDetailsDTO } from '@/lib/db/dto/products.dto';
import ProductDetails from '@/components/Admin/ProductPage/ProductDetails';

interface Props {
    params: { id: string };
}

export default async function AdminProductDetailPage({ params }: Props) {

    const { id } = await params

    const product = await fetchProductDetail(id);

    return (
        <div className="space-y-6 sm:space-y-8 animate-fade-in">
            <ProductDetails product={product} />
        </div>
    );
}

async function fetchProductDetail(id: string): Promise<AdminProductDetailsDTO> {
    const headerList = await headers();

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/admin/product/${encodeURIComponent(id)}`,
        {
            headers: {
                cookie: headerList.get("cookie") ?? "",
            },
            cache: "no-store",
        }
    );

    if (!response.ok) {
        notFound();
    }

    const json = await response.json();

    if (!json?.success || !json.data) {
        notFound();
    }

    return json.data as AdminProductDetailsDTO;
}

