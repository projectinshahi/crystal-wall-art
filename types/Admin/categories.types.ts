export type CategoryTypes = {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  priority: number;
  parent_id: string | null; // null = main category, set = subcategory of that category
  is_active: boolean;
  deleted: boolean;
  created_at: string;
  updated_at: string;
};