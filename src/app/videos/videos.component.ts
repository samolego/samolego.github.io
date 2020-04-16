import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Tooltips Initialization
    $('document').ready(function(){
      (<any> $('[data-toggle=tooltip]')).tooltip();
	  });
    const url = "https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=UCtPiCXgdX4A3UCk-2oYZITw";
    $.getJSON( url, function(data) {
        for(let i = 0; i < 9; i++) {
          // Packing the HTML
          let video = data.items[i];
          let videoCard = document.createElement("div");
          videoCard.className = "col-lg-4 col-md-12 mb-4";
          videoCard.innerHTML =
          `<div class="card">
            <div class="view overlay">
              <a href="` + video.link + `" target="_blank" data-toggle="tooltip" data-placement="right" title="` + video.title + `">
                <img src="` + video.thumbnail + `" class="img-fluid" alt="` + video.title + `">
              </a>
            </div>
          </div>`;
          // Displaying HTML
          document.getElementById("videos").appendChild(videoCard);
        }
    });
  }

}