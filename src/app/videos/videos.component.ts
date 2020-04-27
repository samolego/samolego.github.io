import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit {
  videos;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.jsonp('https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=UCtPiCXgdX4A3UCk-2oYZITw', 'callback')
    .subscribe(data => {
      this.videos = data["items"];
    });
  }
}