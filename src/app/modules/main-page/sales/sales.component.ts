import { Component } from '@angular/core';

@Component({
  selector: 'flower-valley-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
})
export class SalesComponent {
  public sales = [
    {
      title: '30% скидка на тюльпаны',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bibendum euismod duis id lorem etiam feugiat. Aenean mi aenean maecenas.',
      img: 'assets/images/mocks/sales/sale_1.png',
    },
    {
      title: '20% скидка ко дню рождения',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      img: 'assets/images/mocks/sales/sale_2.png',
    },
  ];
}
