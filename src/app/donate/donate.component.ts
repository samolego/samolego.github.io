import {Component, OnInit} from '@angular/core';
import {Clipboard} from '@angular/cdk/clipboard';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss']
})
export class DonateComponent implements OnInit {
  public btcAddress = "3G48MrV4zyXhKjBDk6rZvYnVx8rJcuz8va";
  public alertVisible: boolean;

  constructor(private clipboard: Clipboard) {
    this.alertVisible = false;
  }

  ngOnInit(): void {
  }

  copyBtcAddress() {
    this.clipboard.copy(this.btcAddress);
    this.alertVisible = true;
    setTimeout(() => {
      this.alertVisible = false;
    }, 1000);
  }
}
