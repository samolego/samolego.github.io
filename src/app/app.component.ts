import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'website';

  ngOnInit(): void {
    // Auto-closing navbar on mobile
    $('.navbar-nav>li>a').on('click', function(){
      (<any>$(".navbar-collapse")).collapse('hide');
    });
  }
}