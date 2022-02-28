import { BusinessPackModel } from './business-pack/business-pack-model';
import { Category } from './category';
import { Price } from './price';
import { Sale } from './sale';
import { BannerPhotos } from './main-banner';

export interface Product extends BusinessPackModel {
  photos: BannerPhotos[];
  description: string;
  categories: Category[];
  boxId: number;
  prices: Price[];
  sale?: Sale;
  productCategoryId: number;
}
