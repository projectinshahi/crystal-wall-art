import ProductList from '@/components/ProductList';
import { Suspense } from 'react';

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

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductList PRODUCTS={PRODUCTS} />
    </Suspense>
  );
}