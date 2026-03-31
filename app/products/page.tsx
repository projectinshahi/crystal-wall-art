"use client"

import ProductCard from '@/components/Card/ProductCard';
import PageHeader from '@/components/common/PageHeader'
import { useSearchParams } from 'next/navigation';

export const PRODUCTS = [
  {
    key: "premium-acrylic-photos",
    label: "Premium Acrylic Photos",
    image: "/products/prd1.jpg",
  },
  {
    key: "3d-frames-classic",
    label: "3D Frames",
    image: "/products/prd2.jpg",
  },
  {
    key: "personalized-wall-clock",
    label: "Personalized Wall Clock",
    image: "/products/prd3.jpg",
  },
  {
    key: "wall-art",
    label: "Wall Art",
    image: "/products/prd4.jpg",
  },
  {
    key: "frame-set",
    label: "Frame Set",
    image: "/products/prd5.jpg",
  },
  {
    key: "special-gifts",
    label: "Special Gifts",
    image: "/products/prd6.jpg",
  },
  {
    key: "personalized-shapes",
    label: "Personalized Shapes",
    image: "/products/prd7.jpg",
  },
  {
    key: "3d-frames-premium",
    label: "3D Frames (Premium)",
    image: "/products/prd8.jpg",
  },
  {
    key: "canvas-print-classic",
    label: "Canvas Print",
    image: "/products/prd9.jpg",
  },
  {
    key: "canvas-print-large",
    label: "Canvas Print (Large)",
    image: "/products/prd10.jpg",
  },
  {
    key: "canvas-print-framed",
    label: "Canvas Print (Framed)",
    image: "/products/prd11.jpg",
  },
  {
    key: "canvas-print-custom",
    label: "Canvas Print (Custom)",
    image: "/products/prd12.jpg",
  },
];

const page = () => {

  const params = useSearchParams();
  const category = params.get('category');

  return (
    <div className='w-full'>
      <PageHeader title={category || 'All Products'} handleBack={() => { }} />
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mt-8 px-4 sm:px-6 lg:px-8'>
          {PRODUCTS.map((product: any) => ProductCard({ product }))}
        </div>
      </div>
    </div>
  )
}

export default page