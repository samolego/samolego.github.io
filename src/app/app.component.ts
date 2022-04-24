import {Component, ElementRef, HostListener} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'samolego.github.io';
  time = new Date();
  private intervalId: number | undefined;

  constructor(private router: Router, private elRef:ElementRef) {}

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.time = new Date();
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  get href(): string | undefined {
    return this.router.url;
  }

  toggleWindow(windowSelector: string, close: boolean = false) {
    const windowElement = <HTMLElement> this.elRef.nativeElement.querySelector(windowSelector);

    if (windowElement) {
      // Animation
      windowElement.classList.toggle('slide-out');
      windowElement.classList.toggle('slide-in');

      const button = <HTMLElement> this.elRef.nativeElement.querySelector(windowSelector + "-button");
      if (button) {
        button.classList.remove(close ? 'is-dark' : 'is-light');
        button.classList.add(close ? 'is-light' : 'is-dark');
      }
    }
  }
}
