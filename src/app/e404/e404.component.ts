import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-e404',
  templateUrl: './e404.component.html',
  styleUrls: ['./e404.component.scss']
})
export class E404Component implements OnInit {
  counter: number;
  private counterInterval: number;

  constructor(private router: Router) {
    this.counter = 0;
    this.counterInterval = setInterval(() => {
      if (this.counter >= 100) {
        this.counter = 0;
        this.router.navigate(['/home']);
      } else {
        this.counter += 1;
      }
    }, 40);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.counterInterval) {
      clearInterval(this.counterInterval);
    }
  }
}
