import {Component, ElementRef, HostListener} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'samolego.github.io';

  constructor(private router: Router, private elRef:ElementRef) {}

  ngOnInit() { }

  get href(): string | undefined {
    return this.router.url;
  }

  toggleWindow(windowSelector: string, close: boolean = false) {
    const window = <HTMLElement> this.elRef.nativeElement.querySelector(windowSelector);

    if (window) {
      // Animation
      window.style.display = window.style.display === 'none' ? '' : 'none';

      const button = <HTMLElement> this.elRef.nativeElement.querySelector(windowSelector + "-button");
      if (button) {
        button.classList.remove(close ? 'is-dark' : 'is-light');
        button.classList.add(close ? 'is-light' : 'is-dark');
      }

    }
  }
}
