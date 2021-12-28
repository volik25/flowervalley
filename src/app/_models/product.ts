import { BusinessPackModel } from './business-pack/business-pack-model';
import { Category } from './category';

export interface Product extends BusinessPackModel {
  photos: string[];
  description: string;
  categories?: Category[];
}
