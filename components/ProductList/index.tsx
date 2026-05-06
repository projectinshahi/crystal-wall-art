"use client";

import ProductCard from "@/components/Card/ProductCard";
import PageHeader from "@/components/common/PageHeader";
import Container from "@/components/Container/Container";
import { ProductTypes } from "@/types/Admin/products.types";
import { useEffect, useState } from "react";
import ProductCardSkeleton from "../skeletons/ProductCardSkeleton";

const ProductList = ({
  categoryName = "All Products",
  categoryId,
}: {
  categoryName: string;
  categoryId?: string;
}) => {
  const [data, setData] = useState<ProductTypes[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams({
        // ...(categoryId && { category: categoryId }),
        active: "true",
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/products/${categoryId}/category?${query}`
      );

      const prodRes = await res.json();

      if (!prodRes.success || !prodRes.data?.length) {
        setData([]);
        return;
      }

      setData(prodRes.data);
    } catch (err) {
      console.error("Fetch products error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  return (
    <div className="w-full">
      <PageHeader title={categoryName} handleBack={() => { }} />

      <Container className="max-w-7xl mx-auto px-0 sm:px-0 lg:px-0">
        {/* 🔄 Loading */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mt-8 px-4 sm:px-6 lg:px-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* ❌ Empty */}
        {!loading && data.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No products found
          </div>
        )}

        {/* ✅ Data */}
        {!loading && data.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mt-8 px-4 sm:px-6 lg:px-8">
            {data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default ProductList;