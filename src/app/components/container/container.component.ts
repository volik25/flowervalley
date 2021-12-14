import { Component, Input, ViewEncapsulation } from '@angular/core';
import { BackgroundType } from './background.enum';

@Component({
  selector: 'flower-valley-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ContainerComponent {
  @Input()
  public headerTitle: string | undefined;
  @Input()
  public headerIcon: string | undefined;
  @Input()
  public headerIconImage: string | undefined;
  @Input()
  public background: BackgroundType = BackgroundType.LIGHT;
  @Input()
  public headerButton: Record<string, any> | undefined;
  @Input()
  public footerButton: Record<string, any> | undefined;
  public get backgroundEnum() {
    return BackgroundType;
  }
}
