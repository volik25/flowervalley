export interface Order {
  id: number;
  clientId?: string;
  clientInn?: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  deliveryPrice: number;
  orderDate: Date;
  products: OrderItem[];
  boxes: OrderItem[];
}

export interface OrderItem {
  id: string | number;
  price: number;
  count: number;
}
