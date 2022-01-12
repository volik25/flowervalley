import { Component, Input } from '@angular/core';
import { responsiveOptions } from '../../../_utils/constants';
import { Feedback } from '../../../_models/feedback';

@Component({
  selector: 'flower-valley-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
})
export class ReviewsComponent {
  public responsiveOptions = responsiveOptions;
  @Input()
  public isAdmin: boolean = false;
  @Input()
  public reviews: Feedback[] = [];

  public displayCustom: boolean = false;

  public activeIndex: number = 0;

  public openImage(id: number): void {
    this.activeIndex = this.reviews.findIndex((item) => item.id === id);
    this.displayCustom = true;
  }

  private editReview(): void {}

  private deleteReview(): void {}
}
