import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'flower-valley-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
})
export class ReviewsComponent {
  public visibleBlocks = 5;
  @HostListener('window:resize')
  private updateVisible() {
    if (window.innerWidth < 1200) {
      this.visibleBlocks = 1;
    } else {
      this.visibleBlocks = 5;
    }
  }
  constructor() {
    this.updateVisible();
  }
  public reviews = [
    {
      src: 'assets/images/mocks/reviews/1.png',
      link: '',
    },
    {
      src: 'assets/images/mocks/reviews/2.png',
      link: '',
    },
    {
      src: 'assets/images/mocks/reviews/3.png',
      link: '',
    },
    {
      src: 'assets/images/mocks/reviews/4.png',
      link: '',
    },
    {
      src: 'assets/images/mocks/reviews/5.png',
      link: '',
    },
    {
      src: 'assets/images/mocks/reviews/1.png',
      link: '',
    },
    {
      src: 'assets/images/mocks/reviews/2.png',
      link: '',
    },
    {
      src: 'assets/images/mocks/reviews/3.png',
      link: '',
    },
    {
      src: 'assets/images/mocks/reviews/4.png',
      link: '',
    },
    {
      src: 'assets/images/mocks/reviews/5.png',
      link: '',
    },
    {
      src: 'assets/images/mocks/reviews/1.png',
      link: '',
    },
    {
      src: 'assets/images/mocks/reviews/2.png',
      link: '',
    },
    {
      src: 'assets/images/mocks/reviews/3.png',
      link: '',
    },
    {
      src: 'assets/images/mocks/reviews/4.png',
      link: '',
    },
    {
      src: 'assets/images/mocks/reviews/5.png',
      link: '',
    },
  ];
}
