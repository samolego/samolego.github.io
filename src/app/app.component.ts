import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { exit } from 'process';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  cookiesEnabled: boolean = false;
  hideConsole: boolean = false;
  cmds = [
    "help",
    "?",
    "y",
    "yes",
    "n",
    "no",
    "hide",
    "clear",
    "cd",
    "ls",
    "pwd"
  ];
  consoleLines;
  consoleInput: HTMLInputElement;
  selectedCmd: number = -1;
  usedCmds = [];

	constructor(private router: Router, private route: ActivatedRoute) {
    this.cookiesEnabled = <boolean> <unknown> localStorage.getItem("cookiesEnabled");
    if(this.cookiesEnabled == null)
      this.cookiesEnabled = false;
  }
  
  ngOnInit(): void {
    // Footer styling
    document.getElementById("main").style.minHeight = 
    Math.max(
      document.documentElement.clientHeight, window.innerHeight ||
      0
    ) - 195 + "px";

    this.consoleLines = document.getElementById("consoleLines");
    this.consoleInput = <HTMLInputElement>document.getElementById("consoleInputText");

    // This took to long to figure out ...
    //document.onkeypress = (evt) => this.consoleTyping(evt);
    document.onkeydown = (evt) => this.consoleTyping(evt);
  }

  // Thanks to https://stackoverflow.com/questions/7060750/detect-the-enter-key-in-a-text-input-field
  consoleTyping(evt): void { 
    var evt = (evt) ? evt : ((event) ? event : null); 
    var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);

    // if enter was pressed
    if ((evt.keyCode == 13) && (node.type=="text"))  {
      let consoleDiv = <HTMLInputElement> document.getElementById("consoleDiv");
      
      // Adding used command to console lines
      this.consoleLines.append(this.newLine("~ root# " + this.consoleInput.value));

      let c = this.consoleInput.value;
      if(c != "")
        this.usedCmds.unshift(c);
      var cmd = c.toLowerCase().split(" ");
      this.proccessCommand(cmd);
      
      this.selectedCmd = -1;
      this.consoleInput.value = null;
      // Scrolling to bottom of console
      consoleDiv.scrollTop = consoleDiv.scrollHeight;
    }

    // Up arrow
    else if((evt.keyCode == 38) && (node.type=="text")) {
      this.selectedCmd++;
      if(this.usedCmds[this.selectedCmd] != undefined) {
        this.consoleInput.value = this.usedCmds[this.selectedCmd];      
        console.log(this.usedCmds, " " + this.selectedCmd);
      }
      else {
        this.consoleInput.value = "";
        this.selectedCmd < this.usedCmds.length ? this.selectedCmd++: this.selectedCmd = this.usedCmds.length;
        console.log(this.usedCmds, " " + this.selectedCmd);
      }
    }

    // Down arrow
    else if((evt.keyCode == 40) && (node.type=="text")) {
      this.selectedCmd--;
      if(this.usedCmds[this.selectedCmd] != undefined)
        this.consoleInput.value = this.usedCmds[this.selectedCmd];
      else {
        this.consoleInput.value = "";
        this.selectedCmd > 0 ? this.selectedCmd--: this.selectedCmd = -1;
        console.log(this.usedCmds, " " + this.selectedCmd);
      }
    }
  }

  async proccessCommand(cmd): Promise<void> {
    // Switch for recognising commands
    switch(cmd[0]) {
      case this.cmds[0]:
      case this.cmds[1]:
        this.consoleLines.append(this.newLine("Available commands:"));
        this.cmds.forEach(element => {
          this.consoleLines.append(element + ", ");
        });
        this.consoleLines.append(this.newLine(""));
        break;
      case this.cmds[2]:
      case this.cmds[3]:
        // yes
        this.toggleCookies(true);
        break;
      case this.cmds[4]:
      case this.cmds[5]:
        // no
        this.toggleCookies(false);
        break;
      case this.cmds[6]:
        // hide
        this.hideConsole = true;
        break;
      case this.cmds[7]:
        // clear
        this.consoleLines.innerHTML = null;
        break;
      case this.cmds[8]:
        // cd
        this.router.navigateByUrl(cmd[1]);
        break;
      case this.cmds[9]:
        // ls
        this.router.config.forEach(element => {
          this.consoleLines.append(this.newLine(element.path));
        });
        break;
      case this.cmds[10]:
        // pwd
        this.route.params.subscribe(params => {
          this.consoleLines.append(this.newLine(this.router.url));
        });
        break;
      case "":
        // Enter
        break;
      default:
        this.consoleLines.append(this.newLine(cmd[0] + " is not a valid command. Type \"help\" or \"?\" for available commands."));
        break;
    }
  }

  newLine(command) {
    let response = document.createElement("span");
    response.innerHTML = command + "<br>";
    return response;
  }
  
  toggleCookies(enable: boolean) {
    if(enable) {
      this.consoleLines.append(this.newLine("Cookies are now enabled. Type \"hide\" to hide console."));
      localStorage.setItem("cookiesEnabled", "true");
      this.cookiesEnabled = true;
    }
    else {
      this.consoleLines.append(this.newLine("Cookies are disabled. Seems like you don't have a sweet tooth. If you want to hide the console, use \"hide\"."));
      localStorage.removeItem("cookiesEnabled");
      this.cookiesEnabled = false;
    }
  }
}