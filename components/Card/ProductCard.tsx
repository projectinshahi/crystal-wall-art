"use client"

import { ProductTypes } from '@/types/Admin/products.types';
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const getProductImageUrl = (value?: string | null): string => {
    if (!value) return "";

    const trimmed = value.trim();
    if (!trimmed) return "";

    try {
        const parsed = JSON.parse(trimmed);
        const url = typeof parsed === 'string'
            ? parsed
            : parsed?.url || parsed?.image_url || parsed?.secure_url;
        return typeof url === 'string' ? url : trimmed;
    } catch {
        return trimmed;
    }
};

const ProductCard = ({ product }: { product: ProductTypes }) => {

    const router = useRouter();

    const image = getProductImageUrl(product.thumbnail);

    return (
        <div
            key={product.id}
            className="flex flex-col items-center"
        >

            <button
                onClick={() => router.push(`/product/${product.id}`)}
                className="group w-full rounded-[28px] border-2 border-lightBackground hover:border-primary/40 hover:shadow-lg transition-all cursor-pointer overflow-hidden"
            >

                <div className="flex items-center justify-center">

                    <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-muted">

                        {image ? (
                            <Image
                                src={image}
                                alt={product.title}
                                fill
                                sizes="(max-width:640px) 140px, (max-width:1024px) 170px, 200px"
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                No image
                            </div>
                        )}

                    </div>

                </div>

            </button>

            <span className="mt-3 text-sm sm:text-base font-medium text-foreground text-center">
                {product.title}
            </span>

        </div>
    )
}

export default ProductCard