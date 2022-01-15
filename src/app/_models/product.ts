import { BusinessPackModel } from './business-pack/business-pack-model';
import { Category } from './category';
import { Price } from './price';

export interface Product extends BusinessPackModel {
  photos: { id: number; src: string }[];
  description: string;
  categories: Category[];
  boxId: number;
  prices: Price[];
}
