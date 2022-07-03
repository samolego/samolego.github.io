import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DOCUMENT} from "@angular/common";
import {MatMenuTrigger} from "@angular/material/menu";


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
  components: Set<string>;
  activeWindows: Set<HTMLElement>;
  navbarExtended: boolean;

  constructor(public router: Router, private elRef: ElementRef, @Inject(DOCUMENT) private document: any, public route: ActivatedRoute) {
    this.fullscreen = false;
    this.navbarExtended = false;

    // Setting available components
    this.components = new Set();
    this.router.config.forEach(route => {
      if (route !== undefined) {
        this.components.add(route.path as string);
      }
    });

    this.activeWindows = new Set();
  }


  ngAfterViewInit() {
    this.intervalId = setInterval(() => {
      this.time = new Date();
    }, 1000);

    this.elRef.nativeElement.querySelectorAll(".window").forEach((element: HTMLElement) => this.activeWindows.add(element));

    // debug
    this.toggleWindow("#notepad-window", true);
    this.toggleWindow("#explorer-window", true);
    //this.notepadContent(this.elRef.nativeElement.querySelector("#main-content").innerHTML);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  get href(): string | undefined {
    return this.router.url;
  }

  toggleWindow(windowSelector: string, close: boolean = false) {
    const windowElement = this.elRef.nativeElement.querySelector(windowSelector) as HTMLElement;

    if (windowElement) {
      // Get window with highest zIndex in this.activeWindows
      const elements = [...this.activeWindows.keys()].sort((a: HTMLElement, b: HTMLElement) => a.style.zIndex > b.style.zIndex ? -1 : 1);

      if (elements[0] === windowElement && !close) {
        // Animation
        windowElement.classList.toggle('slide-out');
        windowElement.classList.toggle('slide-in');
      } else {
        this.reorderWindows(windowElement);

        if (close) {
          this.activeWindows.delete(windowElement);
          windowElement.classList.toggle('slide-out');
          windowElement.classList.toggle('slide-in');

          //windowElement.classList.add('slide-out');
          //windowElement.classList.remove('slide-in');
        } else {
          if (elements[0] === windowElement || !this.activeWindows.has(windowElement)) {
            windowElement.classList.toggle('slide-out');
            windowElement.classList.toggle('slide-in');
          }
          this.activeWindows.add(windowElement);
          // Open window
          //windowElement.classList.remove('slide-out');
          //windowElement.classList.add('slide-in');
        }
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

  reorderWindows(active: HTMLElement) {
    // Loop through all windowss
    //const windows = [...this.elRef.nativeElement.querySelectorAll(".window")];
    const windows = [...this.activeWindows.keys()].sort((a: HTMLElement, b: HTMLElement) => a.style.zIndex < b.style.zIndex ? -1 : 1);

    // Sort windows by zIndex style
    if (windows.length > 1) {

      // Assign 100 + i zIndex to each window
      for (let i = 0; i < windows.length; i++) {
        windows[i].style.zIndex = (100 + i).toString();
      }
    }

    active.style.zIndex = (100 + windows.length).toString();
  }

  canShowDir(path: string): boolean {
    // Check router url and path
    path = '/' + path;

    if (this.router.url === path) {
      return false;
    }

    if (this.router.url === '/') {
      return path.split('/').length === 2;
    }

    if (this.router.url.split('/').length === path.split('/').length) {

    }
    return path.startsWith(this.router.url);
  }

  openNotepad() {
    this.reloadNotepad();
    this.toggleWindow("#notepad-window");
    //this.reorderWindows(this.elRef.nativeElement.querySelector("#notepad-window"));
  }


  notepadContent(content: string) {
    // Add new lines after each ">"
    const lines = content.split('>');
    let newContent = '';
    let tab = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
        .split(' ')
        .filter(value => !value.startsWith("_"))
        .join(' ');

      if (line.includes('<') && !line.includes("img") && !line.includes("</")) {
        ++tab;
      }

      newContent += ' '.repeat(tab * 4) + line;

      if (line.includes('</')) {
        --tab;
      }

      if (i + 1 < lines.length) {
        newContent += '>\n';
      }
    }

    this.elRef.nativeElement.querySelector("#notepad-content").value = newContent;
  }

  saveNotepad() {
    this.elRef.nativeElement.querySelector("#main-content router-outlet").nextSibling.innerHTML =
      this.elRef.nativeElement.querySelector("#notepad-content").value;
  }

  reloadNotepad() {
    this.notepadContent(this.elRef.nativeElement.querySelector("#main-content router-outlet").nextSibling.innerHTML);
  }

  @ViewChild(MatMenuTrigger, {static: true}) matMenuTrigger: MatMenuTrigger | undefined;
  menuTopLeftPosition = {
    x: "0px",
    y: "0px"
  };

  onFileRightClick(event: MouseEvent, path: string) {
    event.preventDefault();

    this.menuTopLeftPosition.x = event.clientX + 'px';
    this.menuTopLeftPosition.y = event.clientY + 'px';

    // @ts-ignore
    this.matMenuTrigger.menuData = {item: path};

    // we open the menu
    // @ts-ignore
    this.matMenuTrigger.openMenu();
  }

  deleteFile(event: MouseEvent) {
    const item = this.matMenuTrigger?.menuData.item;
    if (item) {
      console.log(item);
      let path = "";
      if (item === 'index.html') {
        path = this.router.url.substring(1);
        console.log("url:", path);
      } else {
        path = item;
      }

      this.components.delete(path);


      for (const el of this.router.config) {
        console.log("Checking", el);
        if (el.path === path) {
          console.log("Found", el);
          el.path = '';
          el.component = undefined;
          if (this.router.url.substring(1) === path) {
            // Redirect to 404
            this.router.navigateByUrl('/404');
          }
          break;
        }
      }
    }
  }
}
