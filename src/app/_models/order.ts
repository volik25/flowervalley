import { Product } from './product';
import { Box } from './box';
import { OrderStatus } from '../_utils/order-status.enum';

export interface Order {
  id: number;
  clientId?: string;
  clientInn?: string;
  accountNumber?: string;
  requestNumber?: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  deliveryPrice: number;
  orderDate: Date;
  status: OrderStatus;
  products: OrderProduct[];
  boxes: OrderBox[];
}

export interface OrderItem {
  id: string | number;
  price: number;
  count: number;
}

export interface OrderProduct extends OrderItem {
  product: Product;
}

export interface OrderBox extends OrderItem {
  box: Box;
}
