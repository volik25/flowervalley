export interface Sale {
  id: number;
  category: {
    id: number;
    name: string;
  };
  categoryId?: number;
  discount: number;
  productId?: number;
  img: string;
  title: string;
}
