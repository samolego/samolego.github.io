import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss']
})
export class DonateComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  copyBtcAddress() {
    let btcAddress = document.getElementById("btcAddress") as HTMLInputElement;;

    /* Select the text field */
    btcAddress.select();
    btcAddress.setSelectionRange(0, 99999);
  
    /* Copy the text inside the text field */
    document.execCommand("copy");
    /* Alert the copied text */
    document.getElementById("clipboardCopied").style.display = "";
  }
  async hideClipboardAlert() {
    document.getElementById('clipboardCopied').style.display = 'none';
  }
}
