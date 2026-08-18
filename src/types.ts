export type Category = 'All' | 'Rings' | 'Necklaces' | 'Earrings' | 'Bracelets';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  description: string;
  isNew?: boolean;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  image: string;
  productInfo: string;
}
