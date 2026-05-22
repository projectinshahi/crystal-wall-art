"use server"

import HomeContentWrapper from './HomeContentWrapper'
import { Typography } from '../ui/Typography'
import Image from 'next/image'
import Link from 'next/link'
import { CategoryFormOutput } from '@/schema/category.schema'

const getImageUrl = (img: any) => {
    if (!img) return "";
    if ("previewUrl" in img) return img.previewUrl; // pending
    if ("url" in img) return img.url; // uploaded
    return "";
};

type CategoryWithImage = CategoryFormOutput & {
    image: string;
};

const CategoriesSection = async () => {
    console.log("url",process.env.NEXT_PUBLIC_URL);

    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/category?active=true`);

    const catRes = await res.json();
    console.log("catRes",catRes);

    if (!catRes?.success) return null;

    const categories: CategoryWithImage[] = catRes.data
        .map((item: CategoryFormOutput) => {
            let parsed;

            try {
                parsed =
                    typeof item.image_url === "string"
                        ? JSON.parse(item.image_url)
                        : item.image_url;
            } catch {
                parsed = null;
            }

            return {
                ...item,
                image: getImageUrl(parsed),
            };
        })
        .filter((item: CategoryWithImage) => !!item.image);
        
    return (
        <HomeContentWrapper wrapperClassName="bg-lightGray mt-5">
            <Typography className="text-xl sm:text-2xl lg:text-3xl font-display font-medium text-center mb-5">
                Categories
            </Typography>

            <div className="flex justify-center gap-4 sm:gap-10 flex-wrap">
                {categories.map((item) => (
                    <div
                        key={item.id}
                        className="flex flex-col items-center w-[140px] sm:w-[170px] lg:w-[200px]"
                    >
                        <Link
                            href={`/products?category=${encodeURIComponent(item.id as string)}`}
                            className="group w-full rounded-[28px] border-2 border-lightBackground hover:border-primary/40 hover:shadow-lg transition-all overflow-hidden"
                        >
                            <div className="relative w-full aspect-square rounded-xl bg-muted overflow-hidden">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    sizes="(max-width:640px) 140px, (max-width:1024px) 170px, 200px"
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </Link>

                        <span className="mt-3 text-sm sm:text-base font-medium text-foreground text-center">
                            {item.title}
                        </span>
                    </div>
                ))}
            </div>
        </HomeContentWrapper>
    )
}

export default CategoriesSection
