import { Component, OnInit } from '@angular/core';
import { HttpClientJsonpModule, HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-ci',
  templateUrl: './ci.component.html',
  styleUrls: ['./ci.component.scss']
})
export class CiComponent implements OnInit {
  url;
  repos;
  projectName;
  builds;
  selectedBuild;
  workflowRuns;
  steps;
  availableDownloads;
  downloadLink;
  urlParams;

	constructor(private http: HttpClient) {
    this.http.jsonp('https://api.github.com/users/samolego/repos', 'callback').subscribe(data => {
      this.repos = data["data"];
    });
  }
  

  ngOnInit(): void {
    this.url = location.origin + location.pathname + "?";
    // Getting URL parameters
    this.urlParams = new URLSearchParams(location.search.substring(1));
    var project = this.urlParams.get("project");
    if(project != null)
      // Selecting project if requested by parameters
      this.loadProjectBuilds(project);
  }

  // Gets the color for the html components, depending on the result
  getColor(result) {
    if(result == "success")
      return "green";
    else if(result == "failure")
      return "red";
    return "light";
  }

  // Sets the data for the "side window" with project builds
  loadProjectBuilds(repoName) {
    // Nulling the previous project data
    this.workflowRuns = null;
    this.builds = null;
    this.selectedBuild = null;
    this.steps = null;
    this.availableDownloads = null

    this.projectName = repoName;
    const baseUrl = "https://api.github.com/repos/samolego/" + this.projectName;

    // Setting URL parameters
    this.urlParams.set("project", this.projectName);
    history.replaceState(null, "CI for " + this.projectName, this.url + decodeURIComponent(this.urlParams));

    // Requesting GH runs of project
    this.http.jsonp(baseUrl + '/actions/runs', 'callback').subscribe(data => {
      this.builds = data["data"];
      this.workflowRuns = this.builds.workflow_runs;

      // If build is selected with URL parameters, this gets it
      if(this.urlParams.has("build")) {
        var build = this.urlParams.get("build");

        if(build == "latest") 
          this.loadBuild(0);
        else
          this.loadBuild(this.builds["total_count"] - build);
      }
    });

    // Getting downloads if they are available
    this.http.jsonp(baseUrl + '/contents?ref=dev-builds', 'callback').subscribe(data => {
      this.availableDownloads = data["data"];
    });
  }

  // Sets the data needed for choosed build
  loadBuild(buildNumber) {
    this.steps = null;
    this.downloadLink = null;
    let count = this.builds["total_count"];

    if(count == null)
      return;

    // Checks which build should be selected from JSON array
    // we got from loadProjectBuilds()

    // Setting selected build from array
    this.selectedBuild = this.workflowRuns[ buildNumber ];
    if(this.selectedBuild == null)
      return;
    this.selectedBuild["build_number"] = count - buildNumber;

    // Setting URL parameters
    this.urlParams.set("build", count - buildNumber);
    history.replaceState(null, "CI for " + this.projectName, this.url + decodeURIComponent(this.urlParams));

    // Requesting build data
    this.http.jsonp(this.selectedBuild.jobs_url, 'callback').subscribe(data => {
      // Checks for steps to show in "console" div
      try {
        this.steps = data["data"]["jobs"][0]["steps"];
      } catch {
        this.steps = null;
      }
    });

    // Setting download link of build if it exists
    if(this.availableDownloads != null) {
      let downloadCount = this.availableDownloads.length;
      if(downloadCount > buildNumber)
        this.downloadLink = this.availableDownloads[ buildNumber ]["download_url"];
    }
  }
}
