import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-e404',
  templateUrl: './e404.component.html',
  styleUrls: ['./e404.component.scss']
})
export class E404Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
    document.getElementById("pageTitle").innerHTML = location.pathname.substr(1);

    // Playing sounds
    let click = new Audio("https://gamepedia.cursecdn.com/minecraft_gamepedia/4/4d/Click.ogg");
    let fuse = new Audio("https://gamepedia.cursecdn.com/minecraft_gamepedia/d/de/Fuse.ogg");
    let explosion = new Audio("https://gamepedia.cursecdn.com/minecraft_gamepedia/4/44/Zombie_breaks_door.ogg");

    click.play();
    click.onended = function() {
      fuse.play();
      fuse.onended = function() {
        explosion.play();
          document.getElementById("fakePage").classList.add("hinge");
          document.getElementById("e404").style.display = "";

          // removing fakepage from display
          setTimeout(
            function() {
              document.getElementById("fakePage").style.display = "none";
            },
            1500
          );
          
      }
    }
  }
}
