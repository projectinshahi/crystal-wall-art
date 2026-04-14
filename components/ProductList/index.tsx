"use client"

import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/Card/ProductCard';
import PageHeader from '@/components/common/PageHeader'
import Container from '@/components/Container/Container';

const ProductList = ({ PRODUCTS }: any) => {
  const params = useSearchParams();
  const category = params.get('category');

  return (
    <div className='w-full'>
      <PageHeader title={category || 'All Products'} handleBack={() => { }} />
      <Container className='max-w-7xl mx-auto px-0 sm:px-0 lg:px-0'>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mt-8 px-4 sm:px-6 lg:px-8'>
          {PRODUCTS.map((product: any) => (
            <ProductCard key={product.key} product={product} />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default ProductList;