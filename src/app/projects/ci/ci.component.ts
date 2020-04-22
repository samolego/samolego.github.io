import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-ci',
  templateUrl: './ci.component.html',
  styleUrls: ['./ci.component.scss']
})
export class CiComponent implements OnInit {
  repos;
  projectName;
  builds;
  selectedBuild;
  workflowRuns;
  steps;
  xhr;

	constructor() {
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

  getColor(result) {
    if(result == "success")
      return "green";
    else if(result == "failure")
      return "red";
    return "light";
  }

  loadProjectBuilds(repoName) {
    this.workflowRuns = null;
    this.builds = null;
    this.selectedBuild = null;
    this.steps = null;
    const xhr = new XMLHttpRequest();
    this.projectName = repoName;
		const url = 'https://api.github.com/repos/samolego/' + this.projectName + '/actions/runs';
		xhr.open("GET", url);
		xhr.send();
		xhr.onreadystatechange = (e) => {
      this.builds = xhr.responseText;
      this.builds = JSON.parse(this.builds);
      this.workflowRuns = this.builds.workflow_runs;
    }      
  }

  loadBuild(buildNumber) {
    let count = this.builds["total_count"];
    if(count == null)
      return;
    const xhr = new XMLHttpRequest();
    this.selectedBuild = this.builds["workflow_runs"][ count - buildNumber ];
    const url = this.selectedBuild.jobs_url
    xhr.open("GET", url);
		xhr.send();
		xhr.onreadystatechange = (e) => {
			this.steps = xhr.responseText;
      this.steps = JSON.parse(this.steps);
      this.steps = this.steps["jobs"][0]["steps"];
    }
  }
}
