import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
	repos;

	constructor(private http: HttpClient) {
	}

	ngOnInit(): void {
		// Getting GitHub repos
		this.http.jsonp('https://api.github.com/users/samolego/repos', 'callback')
		.subscribe(data => {
		  this.repos = data["data"];
		});
	}

	getLanguageColor(lang) {
		var hash = 0;
		for (var i = 0; i < lang.length; i++) {
		  hash = lang.charCodeAt(i) + ((hash << 5) - hash);
		}
		var colour = '#';
		for (var i = 0; i < 3; i++) {
		  var value = (hash >> (i * 8)) & 0xFF;
		  colour += ('00' + value.toString(16)).substr(-2);
		}
		return colour;
	  }
}