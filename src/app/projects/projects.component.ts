import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
	// Getting GitHub Repos
	$.getJSON("https://api.github.com/users/samolego/repos", function(repos){
			$.each(repos, function(index) {
				let license = repos[index].license;
				if(license == null) {
					license = "Not detected";
				}
				else license = license.spdx_id;
				let language = repos[index].language;
				if(language == null) {
					language = "Not detected";
				}
				let description = repos[index].description;
				if(description == null) {
					description = "Description not provided.";
				}
				// Packing the HTML
				let repo = document.createElement("div");
				repo.className = "col-lg-4 col-md-12 mb-4";
				repo.innerHTML = 
					`<div class="card">
						<div class="card-body">
							<h4 class="card-title"><a href="` + repos[index].html_url + `" style="color: black;" target="_blank">` + repos[index].name + `</a></h4>
							<span class="badge stylish-color-dark">License <span class="badge light-green darken-4">` + license + `</span></span>
							<span class="badge cyan darken-4">Issues:<span class="badge unique-color">` + repos[index].open_issues_count + `</span></span>
							<span class="badge green darken-4">Stars:<span class="badge unique-color-dark">` + repos[index].stars + `</span></span>
							<span class="badge light-green darken-4">Language:<span class="badge unique-color-dark">` + language + `</span></span><br>
							<p class="card-text mt-2">` + description + `</p>
						</div>
					</div>`;
				// Displaying HTML
				document.getElementById("repos").appendChild(repo);
			});
		});
	}
}