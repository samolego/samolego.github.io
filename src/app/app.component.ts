import {Component, ElementRef, Inject} from '@angular/core';
import {Router} from '@angular/router';
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'samolego.github.io';
  time = new Date();
  private intervalId: number | undefined;
  private fullscreen: boolean;
  components: Set<any>;
  private activeWindow: HTMLElement;

  constructor(public router: Router, private elRef: ElementRef, @Inject(DOCUMENT) private document: any) {
    this.fullscreen = false;

    // Setting available components
    this.components = new Set();
    this.router.config.forEach(element => {
      this.components.add(element.path);
    });

    this.activeWindow = <HTMLElement>this.elRef.nativeElement.querySelector("#firefox-window");
  }

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.time = new Date();
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  get href(): string | undefined {
    return this.router.url;
  }

  toggleWindow(windowSelector: string, close: boolean = false) {
    const windowElement = <HTMLElement> this.elRef.nativeElement.querySelector(windowSelector);

    if (windowElement) {
      if (this.activeWindow === windowElement) {
        // Animation
        windowElement.classList.toggle('slide-out');
        windowElement.classList.toggle('slide-in');
      } else {
        this.reorderWindows(windowElement);
      }


      if (close) {
        //if (this.fullscreen) this.toggleFullscreen(windowSelector);
        //windowElement.style.transform = "";
      }

      const button = <HTMLElement>this.elRef.nativeElement.querySelector(windowSelector + "-button");
      if (button) {
        button.classList.remove(close ? 'is-dark' : 'is-ghost');
        button.classList.add(close ? 'is-ghost' : 'is-dark');
      }
    }
  }

  toggleFullscreen(windowSelector: string) {
    const firefox = <HTMLElement>this.elRef.nativeElement.querySelector(windowSelector);
    firefox.style.transform = "";
    // Resize main content
    const windowElement = <HTMLElement>this.elRef.nativeElement.querySelector("#main-content");
    // Get screen size
    const screenWidth = window.innerWidth;
    // Get element size
    const elementWidth = windowElement.offsetWidth;
    //windowElement.style.transform = "scale(" + (screenWidth / elementWidth) + ")";

    // Scale windowElement through whole page
    const scale = screenWidth / elementWidth;
    console.log(scale);
    windowElement.style.transform = "scale(" + scale + ")";

    // Position element to 0 0 of the screen
    windowElement.style.position = "fixed";
    windowElement.style.top = "0";
    windowElement.style.left = "0";
    windowElement.style.width = "63vw";
    //Show overflow
    windowElement.style.overflow = "auto";
    //Zoom in windowElement
    windowElement.style.transformOrigin = "0 0";
    windowElement.style.height = "100%";


    /*transform: scale(0.1);
    transform-origin: 0% 0% 0px;*/
    /*if (!this.fullscreen) {
      const elem = this.elRef.nativeElement.querySelector(windowSelector);
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        // Firefox
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        // Chrome, Safari and Opera
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        // IE/Edge
        elem.msRequestFullscreen();
      }

      this.fullscreen = true;
    } else {
      this.closeFullscreen();
      this.fullscreen = false;
    }*/

  }

  /* Close fullscreen */
  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
  }

  onDomainEdit() {

  }

  reorderWindows(active: HTMLElement) {
    // Loop through all windowss
    const windows = [...this.elRef.nativeElement.querySelectorAll(".window")];

    // Sort windows by zIndex style

    windows.sort((a: HTMLElement, b: HTMLElement) => {
      const aZIndex = parseInt(a.style.zIndex);
      const bZIndex = parseInt(b.style.zIndex);
      return aZIndex - bZIndex;
    });

    // Assign 100 + i zIndex to each window
    for (let i = 0; i < windows.length; i++) {
      windows[i].style.zIndex = (100 + i).toString();
    }
    active.style.zIndex = (100 + windows.length).toString();
    this.activeWindow = active;
  }
}
