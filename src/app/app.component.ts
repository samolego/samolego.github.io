import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

	constructor() { }
  
  ngOnInit(): void {
    document.getElementById("main").style.minHeight = 
    Math.max(
      document.documentElement.clientHeight, window.innerHeight ||
      0
    ) - 195 + "px";
  }
}