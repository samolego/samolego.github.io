import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit {
  videos;
  selectedVideo;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }


  ngOnInit(): void {
    this.http.get("https://invidio.us/api/v1/channels/UCtPiCXgdX4A3UCk-2oYZITw").subscribe(data => {
      this.videos = data["latestVideos"];
    },
    error => {
      this.videos = "";
    }
    );
  }

  getSafeUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  selectVideo(videoId) {
    this.selectedVideo = "empty";
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.http.get("https://invidio.us/api/v1/videos/" + videoId).subscribe(
      data => {
        this.selectedVideo = data;
      },
      error => {
        this.selectedVideo = {"error": error, "videoId": videoId}
      }
    );
  }
}