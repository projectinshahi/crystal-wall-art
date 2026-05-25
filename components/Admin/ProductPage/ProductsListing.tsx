"use client";

import React, { useEffect, useState } from "react";
import Filters from "./Filters";
import Spinner from "../Loader/Spinner";
import NoProducts from "./NoProducts";
import TableData from "./TableData";
import { ProductTypes } from "@/types/Admin/products.types";
import { PaginationMeta } from "@/lib/db/content.db";

interface Props {
    products: ProductTypes[];
    metaData: PaginationMeta;
}

const ProductsListing = ({ products, metaData }: Props) => {
    const [data, setData] = useState<ProductTypes[]>(products);
    const [meta, setMeta] = useState<PaginationMeta>(metaData);
    const [isLoading, setIsLoading] = useState(false);

    // ✅ Sync when props change (SSR → client navigation)
    useEffect(() => {
        setData(products);
        setMeta(metaData);
        setIsLoading(false);
    }, [products, metaData]);

    return (
        <>
            <Filters />

            {isLoading ? (
                <Spinner />
            ) : data.length === 0 ? (
                <NoProducts />
            ) : (
                <TableData products={data} meta={meta} />
            )}
        </>
    );
};

export default ProductsListing;