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
  showConsoleLog: boolean = false;
  dev: boolean = false;

	constructor(private http: HttpClient) {
    if(this.dev) {
      this.repos = [];
    }
    else
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

  getDate(when: string) {
    let d = new Date(when)
    const options = { month: 'short', day: 'numeric', year: "numeric", hour: 'numeric', minute: 'numeric' };
    return new Intl.DateTimeFormat('default', options).format(d);
  }

  async deselectProject() {
    // Nulling the previous project data
    this.projectName = null;
    this.workflowRuns = null;
    this.builds = null;
    this.selectedBuild = null;
    this.steps = null;
    this.availableDownloads = null;
  }

  async deselectBuilds() {
    // Nulling the previous build data
    this.selectedBuild = null;
    this.steps = null;
  }

  // Sets the data for the "side window" with project builds
  loadProjectBuilds(repoName) {
    this.deselectProject()

    this.projectName = repoName;
    const baseUrl = "https://api.github.com/repos/samolego/" + this.projectName;

    // Setting URL parameters
    this.urlParams.set("project", this.projectName);
    history.replaceState(null, "CI for " + this.projectName, this.url + decodeURIComponent(this.urlParams));

    // Requesting GH runs of project
    if(this.dev) {
      this.builds = {};
      this.workflowRuns = this.builds.workflow_runs;
    }
    else
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

    if(this.dev) {
      this.availableDownloads = null;
    }
    else
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

    if(this.dev) {
      this.steps = [];
    }
    else
      // Requesting build data
      this.http.jsonp(this.selectedBuild.jobs_url, 'callback').subscribe(data => {
        // Checks for steps to show in "console" div
        try {
          this.steps = data["data"]["jobs"][0]["steps"];
        } catch {
          this.steps = null;
        }
      });

    // Scrolling to the project data
    window.scrollTo(0, document.getElementById("projectTitle").offsetWidth);

    // Setting download link of build if it exists
    if(this.availableDownloads != null) {
      let downloadCount = this.availableDownloads.length;
      if(downloadCount > buildNumber)
        // - 1 since we use .length method above
        this.downloadLink = this.availableDownloads[ downloadCount - 1 - buildNumber ]["download_url"];
    }
  }
}
