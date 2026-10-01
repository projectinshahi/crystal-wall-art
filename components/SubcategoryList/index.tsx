"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import Container from "@/components/Container/Container";
import ProductCard from "@/components/Card/ProductCard";
import { ProductTypes } from "@/types/Admin/products.types";

type Subcategory = { id: string; title: string; image_url: string | null };

const imageUrl = (raw: string | null) => {
  try {
    return raw ? JSON.parse(raw)?.url || "" : "";
  } catch {
    return "";
  }
};

// Storefront: a main category's subcategories. Products still attached directly to the
// category (added before subcategories existed) are listed below until they're moved.
const SubcategoryList = ({
  title,
  subcategories,
  products,
}: {
  title: string;
  subcategories: Subcategory[];
  products: ProductTypes[];
}) => {
  const router = useRouter();

  return (
    <div className="w-full">
      <PageHeader title={title} handleBack={() => router.back()} />
      <Container className="max-w-7xl mx-auto px-0 sm:px-0 lg:px-0">
        {subcategories.length === 0 && products.length === 0 && (
          <div className="text-center py-10 text-gray-500">No subcategories found</div>
        )}

        {subcategories.length > 0 && (
          <div className="flex justify-center gap-4 sm:gap-10 flex-wrap mt-8 px-4 sm:px-6 lg:px-8">
            {subcategories.map((sub) => {
              const image = imageUrl(sub.image_url);
              return (
                <div key={sub.id} className="flex flex-col items-center w-[140px] sm:w-[170px] lg:w-[200px]">
                  <Link
                    href={`/products?category=${encodeURIComponent(sub.id)}`}
                    className="group w-full rounded-[28px] border-2 border-lightBackground hover:border-primary/40 hover:shadow-lg transition-all overflow-hidden"
                  >
                    <div className="relative w-full aspect-square rounded-xl bg-muted overflow-hidden">
                      {image && (
                        <Image
                          src={image}
                          alt={sub.title}
                          fill
                          sizes="(max-width:640px) 140px, (max-width:1024px) 170px, 200px"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                  </Link>
                  <span className="mt-3 text-sm sm:text-base font-medium text-foreground text-center">
                    {sub.title}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mt-8 px-4 sm:px-6 lg:px-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default SubcategoryList;
