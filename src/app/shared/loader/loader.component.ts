import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from '../../_services/front/loading.service';

@Component({
  selector: 'flower-valley-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  @Input()
  public appearance: 'full' | 'small' = 'full';
  @ViewChild('loader')
  public loader!: ElementRef;
  @HostListener('window:scroll')
  private positionCheck() {
    const topPosition = document.documentElement.scrollTop;
    const width = window.innerWidth;
    if (this.loader) {
      if (width > 1024) {
        if (topPosition < 180) {
          this.loader.nativeElement.style.top = 180 - topPosition + 'px';
        } else {
          this.loader.nativeElement.style.top = 0;
        }
      } else {
        if (topPosition < 70) {
          this.loader.nativeElement.style.top = 70 - topPosition + 'px';
        } else {
          this.loader.nativeElement.style.top = 0;
        }
      }
    }
  }

  constructor(private ls: LoadingService) {}

  public ngOnInit(): void {
    this.ls.isLoading().subscribe((isLoading) => {
      if (isLoading) this.positionCheck();
    });
  }
}
