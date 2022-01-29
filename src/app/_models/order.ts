export interface Order {
  email: string;
  fullName: string;
  phone: string;
  address: string;
  products: ProductOrder[];
  boxesPrice?: number;
  deliveryPrice?: number;
}

export interface ProductOrder {
  id?: string;
  price: number;
  count: number;
}
