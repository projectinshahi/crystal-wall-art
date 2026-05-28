"use client";

import React, { useEffect, useState } from "react";
import Filters from "./Filters";
import Spinner from "../Loader/Spinner";
import NoProducts from "./NoProducts";
import TableData from "./TableData";
import { ProductTypes } from "@/types/Admin/products.types";
import { PaginationMeta } from "@/lib/db/content.db";

const ProductsListing = () => {
  const [data, setData] = useState<ProductTypes[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>();

  const [isLoading, setIsLoading] = useState(true);

  // 🔥 FILTER STATE MOVED HERE
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (categoryFilter !== "all") params.append("category", categoryFilter);

      const queryString = params.toString();

      const url = queryString
        ? `/api/admin/product?page=1&limit=10&${queryString}`
        : `/api/admin/product?page=1&limit=10`;

      const res = await fetch(url, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch products");

      const json = await res.json();

      setData(json.data || []);
      setMeta(json.meta);
    } finally {
      setIsLoading(false);
    }
  };

  // 🚀 fetch only when filters change (NOT initial render needed)
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProducts();
    }, 400);

    return () => clearTimeout(handler);
  }, [search, statusFilter, categoryFilter]);

  return (
    <>
      <Filters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />

      {isLoading ? (
        <Spinner />
      ) : data.length === 0 ? (
        <NoProducts />
      ) : (
        <TableData products={data} meta={meta} setData={setData} />
      )}
    </>
  );
};

export default ProductsListing;