"use client"

import { ProductTypes } from '@/types/Admin/products.types';
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const ProductCard = ({ product }: { product: ProductTypes }) => {

    const router = useRouter();

    const image = product.thumbnail ? JSON.parse(product.thumbnail).url : "";

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

                        <Image
                            src={image}
                            alt={product.title}
                            fill
                            sizes="(max-width:640px) 140px, (max-width:1024px) 170px, 200px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />

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