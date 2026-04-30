"use server"

import ProductList from '@/components/ProductList';
import { Suspense } from 'react';

export default async function Page({
  searchParams,
}: {
  searchParams: { category?: string };
}) {

  const { category } = await searchParams;

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/category/${category}`);

  const categoryRes = await res.json();

  if (!categoryRes.success || !categoryRes.data.is_active) return null

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductList categoryName={categoryRes.data.title} categoryId={category}/>
    </Suspense>
  );
}