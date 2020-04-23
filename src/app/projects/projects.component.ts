import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
	repos;

	constructor() {
		// Getting GitHub Repos
		const xhr = new XMLHttpRequest();
		const url = 'https://api.github.com/users/samolego/repos';
		xhr.open("GET", url);
		xhr.send();
		xhr.onreadystatechange = (e) => {
			this.repos = xhr.responseText;
			this.repos = JSON.parse(this.repos);
		}
	}

	ngOnInit(): void { }
}