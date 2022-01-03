import { Product } from './product';

export interface Category {
  id: number;
  parentId?: number;
  name: string;
  img: string;
  products?: Product[];
}
