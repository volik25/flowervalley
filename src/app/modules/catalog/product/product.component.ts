import { Component } from '@angular/core';

@Component({
  selector: 'flower-valley-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent {
  public mainImage: number = 0;

  public product = {
    id: 1,
    name: 'Кротон (Кодиеум) Петра (разветвленный)',
    photos: [
      'assets/images/mocks/product/1.png',
      'assets/images/mocks/product/2.png',
      'assets/images/mocks/product/3.png',
      'assets/images/mocks/product/4.png',
    ],
    tare: 'Горшок 19см',
    description:
      '«Petra» – уникальный сорт кротона, сегодня считающийся одним из наиболее известных и часто продаваемых. У этого растения крупные яйцевидные листья до 30 см в длину формируют компактную, удивительно орнаментальную крону. Отличительная черта сорта – доминирование только зеленого и желтого окрасов и очень толстые прожилки, расположенные по центру листовой пластины и отходящие от нее «ребрами» с выемчатым краем. Только на очень старых листьях кротона края листовой пластины и центральная жилка приобретают легкий красноватый тон.',
    categories: [1, 2],
    price: 1800,
  };

  public get getMainImage(): string {
    return this.product.photos[this.mainImage];
  }
}
