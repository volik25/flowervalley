import { Goods } from './business-pack/goods';

export interface Product extends Goods {
  id: number;
  photos: string[];
  description?: string;
  count: number;
  categories?: any[];
}
