import { Component, OnInit } from '@angular/core';
import { HttpClientJsonpModule, HttpClient } from '@angular/common/http';


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
  availableDownloads;
  downloadLink;

	constructor(private http: HttpClient) {
    this.http.jsonp('https://api.github.com/users/samolego/repos', 'callback').subscribe(data => {
     this.repos = data["data"];
    });
  }
  

  ngOnInit(): void {
    let urlParams = new URLSearchParams(window.location.search);
    var project = urlParams.get("project");
    if(project != null)
      this.loadProjectBuilds(project);
  }

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
    this.availableDownloads = null

    var urlParams = new URLSearchParams(window.location.search);

    this.projectName = repoName;
    const baseUrl = "https://api.github.com/repos/samolego/" + this.projectName;

    this.http.jsonp(baseUrl + '/actions/runs', 'callback').subscribe(data => {
      this.builds = data["data"];
      this.workflowRuns = this.builds.workflow_runs;
      if(urlParams.has("build"))
        this.loadBuild(urlParams.get("build"));
    });

    this.http.jsonp(baseUrl + '/contents?ref=dev-builds', 'callback').subscribe(data => {
      this.availableDownloads = data["data"];
    });
  }

  loadBuild(buildNumber) {
    this.steps = null;
    let count = this.builds["total_count"];
    if(count == null)
      return;

    var which;
    if(buildNumber == "latest") 
      which = 0;
    else
      which = count - buildNumber
    this.selectedBuild = this.builds["workflow_runs"][ which ];
    
    this.http.jsonp(this.selectedBuild.jobs_url, 'callback').subscribe(data => {
      try {
        this.steps = data["data"]["jobs"][0]["steps"];
      } catch {
        this.steps = null;
      }
    });
    if(this.availableDownloads != null) {
      let downloadCount = this.availableDownloads.length - 1;
      let dlNum = downloadCount - which;
      if(dlNum > 0)
        this.downloadLink = this.availableDownloads[ dlNum ]["download_url"];
    }
  }
}
