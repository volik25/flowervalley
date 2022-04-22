import { ProductCategory } from './product';
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
  comment?: string;
  deliveryPrice: number;
  orderDate: Date;
  orderSum: number;
  deliveryWishDateFrom?: Date;
  deliveryWishDateTo?: Date;
  confirmedDeliveryDate?: Date;
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
  product: ProductCategory;
}

export interface OrderBox extends OrderItem {
  box: Box;
}

export interface OrderDiscount {
  value: number;
  percent: number;
}
