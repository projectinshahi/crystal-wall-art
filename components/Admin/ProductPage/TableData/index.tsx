"use client";

import React, { useEffect, useState } from "react";
import DesktopData from "./DesktopData";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProductTypes } from "@/types/Admin/products.types";
import { PaginationMeta } from '@/lib/db/content.db';
import { CategoryTypes } from "@/types/Admin/categories.types";

interface Props {
  products: ProductTypes[];
  meta: PaginationMeta;
}

interface CategoryResponse {
  data: CategoryTypes[];
  message?: string;
}

const TableData = ({ products, meta }: Props) => {
  const [categories, setCategories] = useState<CategoryTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const isMobile = useIsMobile();

  useEffect(() => {
    const controller = new AbortController();

    const fetchCategories = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/admin/category", {
          method: "GET",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store", // avoid stale admin data
        });

        const result: CategoryResponse = await res.json();

        if (!res.ok) {
          throw new Error(result?.message || "Failed to fetch categories");
        }

        setCategories(result.data || []);
      } catch (err: any) {
        if (err.name === "AbortError") return;

        console.error("Category fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();

    return () => controller.abort(); // cleanup
  }, []);

  return (
    <DesktopData
      products={products}
      meta={meta}
      categories={categories} 
    />
  );
};

export default TableData;