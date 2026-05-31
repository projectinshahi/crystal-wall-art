export type ProductImage = {
  id?: string;
  image_url: string;
};

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
  thickness: string[];
  mounting_methods: string[];
  orientations: string[];
  thumbnail: string;
  images?: ProductImage[];
};

export type ProductVariantTypes = {
  id: string;
  product_id: string;
  size: string;
  thickness: number;
  price: number;
  discount_price: number;
  stock_quantity: number;
  orientation: string;
  created_at: string;
  updated_at: string
}