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
  size_images?: Record<string, { url: string; public_id?: string }>; // one optional image per size label
  images?: ProductImage[];
};

export type ProductVariantTypes = {
  id: string;
  product_id: string;
  size: string;
  thickness: number;
  mounting_method: string | null; // null → applies to every mounting method
  price: number;
  discount_price: number;
  stock_quantity: number;
  orientation: string;
  created_at: string;
  updated_at: string
}