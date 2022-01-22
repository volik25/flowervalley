export interface Sale {
  id: number;
  category: {
    id: number;
    name: string;
    categoryOrder: number;
  };
  categoryId?: number;
  discount: number;
  productId?: number;
  currentPrice?: number;
  img: string;
  title: string;
}
