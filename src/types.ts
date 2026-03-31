export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  category: string;
  dialColor?: string;
  strapMaterial?: string;
  movementType?: string;
  stockQuantity: number;
  images: string[];
  isFeatured: boolean;
  isBestseller: boolean;
  isActive: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}
