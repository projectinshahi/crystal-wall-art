export interface SavedAddress {
  id: string;
  type: string;
  name: string;
  phone: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

export interface FormAddress {
  type: string;
  name: string;
  phone: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}