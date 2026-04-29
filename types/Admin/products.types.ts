export type ProductTypes = {
  id: string;
  title: string;
  description: string;
  price: number;
  discount_price: number;
  stock_quantity: number;
  category_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  sizes: string[];
  thicknesses: string[];
  mounting_methods: string[];
  orientations: string[];
  thumbnail: string;
};