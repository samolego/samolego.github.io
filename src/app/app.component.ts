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
  sudoMode: boolean = false;

  // Most of the commands (sudo and su are not listed since user is not trusted :D)
  cmds = [
    "help", // 0
    "?", // 1
    "y", // 2
    "yes", // 3
    "n", // 4
    "no", // 5
    "hide", // 6
    "clear", // 7
    "cd", // 8
    "ls", // 9
    "pwd", // 10
    "kill", // 11
    "htop", // 12
    "ping", // 13
    "rm", // 14
    "exit", // 15
    "extend", // 16
    "shrink" // 17
  ];
  consoleLines;
  consoleInput: HTMLInputElement;
  selectedCmd: number = -1;
  usedCmds = [];
  components;
  consoleDiv: HTMLInputElement;

  username = "cookies";

	constructor(private router: Router, private route: ActivatedRoute) {
    this.cookiesEnabled = <boolean> <unknown> localStorage.getItem("cookiesEnabled");
    if(this.cookiesEnabled == null)
      this.cookiesEnabled = false;
    
    // Setting available components
    this.components = new Set();
    this.router.config.forEach(element => {
      this.components.add(element.path);
    });
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
      this.consoleDiv = <HTMLInputElement> document.getElementById("consoleDiv");
      
      // Adding used command to console lines
      this.consoleLines.append(this.newLine("<span style='color:white;'>" + this.getUsername() + "</span>" + this.consoleInput.value));

      let c = this.consoleInput.value;
      if(c != "") {
        this.usedCmds.unshift(c);
        this.proccessCommand(c.toLowerCase().split(" "));
      }
      
      this.selectedCmd = -1;
      this.consoleInput.value = null;
      // Scrolling to bottom of console
      this.consoleDiv.scrollTop = this.consoleDiv.scrollHeight;
    }

    // Up arrow
    else if((evt.keyCode == 38) && (node.type=="text")) {
      this.selectedCmd++;
      if(this.usedCmds[this.selectedCmd] != undefined)
        this.consoleInput.value = this.usedCmds[this.selectedCmd];
      else {
        this.consoleInput.value = "";
        this.selectedCmd < this.usedCmds.length ? this.selectedCmd++: this.selectedCmd = this.usedCmds.length;
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
      }
    }
  }

  // Main snake of the console - command parser
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
        if(this.username == "cookies")
          this.toggleCookies(true);
        else
          this.consoleLines.append(this.newLine("This user doesn't have permission to toggle cookies."));
        break;
      case this.cmds[4]:
      case this.cmds[5]:
        // no
        if(this.username == "cookies")
          this.toggleCookies(false);
        else
          this.consoleLines.append(this.newLine("This user doesn't have permission to toggle cookies."));
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
        switch(cmd[1]) {
          case "..":
            this.router.navigateByUrl("/");
            break;
          case ".":
            location.reload();
            break;
          default:
            this.router.navigateByUrl(cmd[1]);
            break;
        }
        break;
      case this.cmds[9]:
        // ls
        this.components.forEach(element => {
          this.consoleLines.append(this.newLine(element + "/"));
        });
        break;
      case this.cmds[10]:
        // pwd
        this.route.params.subscribe(params => {
          this.consoleLines.append(this.newLine(this.router.url));
        });
        break;
      case this.cmds[11]:
      case this.cmds[15]:
        // kill || exit
        var w = window.open("", "_self");
        w.document.write("");
        w.close();
        break;
      case this.cmds[12]:
        // htop
        this.consoleLines.append(this.htop());
        break;
      case this.cmds[13]:
        // ping
        this.consoleLines.append(this.newLine("pong"));
        break;
      case this.cmds[14]:
        // rm
        if(!this.sudoMode) {
          this.consoleLines.append(this.newLine("Permission denied."));
          return;
        }
        try {
          if(cmd[2].endsWith("/"))
          cmd[2] = cmd[2].slice(0, -1);
        } catch(ignored) {
          	// not enough args
        }
        // Checking if command is valid
        if(cmd[1] == null || cmd[1] == "")
          this.consoleLines.append(this.newLine("Invalid file or directory name."));
        else if(!this.components.has(cmd[1]) && !this.components.has(cmd[2]))
          this.consoleLines.append(this.newLine("File not found."));
        else if(!cmd[1].startsWith("-r"))
          this.consoleLines.append(this.newLine("Cannot remove " + cmd[1] + ". Is a directory."));
        else {
          this.consoleLines.append(this.newLine("Deleted " + cmd[2] + "."));
          this.components.delete(cmd[2]);

          if(this.router.url.includes(cmd[2])) {
            // Page that user is on was deleted
            this.router.navigateByUrl("/404");
          }

          // Disabling routing to deleted page
          this.router.config.forEach(element => {
            if(element.path == cmd[2]) {
              element.path = "";
              return;
            }
            console.log(element.path);
          });
        }
        break;
      case "sudo":
        // Running with sudo privilegies
        this.sudoMode = true;
        if(cmd[1] == "" || cmd[1] == null) {
          this.consoleLines.append(this.newLine("\"sudo\" requires a command after it."));
          return;
        }
        cmd.shift();

        // We should warn the user about sudo being used
        this.consoleLines.append(this.newLine("<span style='color: #ff0f0f'>Warning! superuser mode used!</span>"));
        this.consoleLines.append(this.newLine("<span style='color: #ffea00'>Great power comes with great responsibility.</span>"));
        
        // Parsing the rest of the command
        await this.proccessCommand(cmd);

        // Disabling superuser
        this.sudoMode = false;
        break;
      case "su":
        // su - switching user
        if(cmd[1] == "" || cmd[1] == null) {
          this.username = "root";
        }
        else if(cmd[1] == "-" && cmd[2] != "" && cmd[2] != null) {
          this.username = cmd[2];
        }
        else
          this.consoleLines.append(this.newLine("Usage: <br> su - \"username\""));
        if(this.username == "root") {
          this.sudoMode = true;
          this.consoleLines.append(this.newLine("<span style='color: #ff0f0f'>Warning! Superuser mode active!</span>"));
        }
        else
          this.sudoMode = false;
        break;
      case this.cmds[16]:
        // Extend
        this.consoleDiv.style.height = (window.innerHeight - 20).toString() + "px";
        this.consoleLines.append(this.newLine("Using extended mode."));
        break;
      case this.cmds[17]:
        // shrink
        this.consoleDiv.style.height = "155px";
        this.consoleLines.append(this.newLine("Using shrinked mode."));
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

  getUsername() {
    if(this.sudoMode)
      return this.username + "@samolego:~ # ";
    return this.username + "@samolego:~ $ ";
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

  htop() {

    return
  }
}