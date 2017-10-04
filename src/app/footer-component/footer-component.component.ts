import { Component, OnInit } from '@angular/core';
import {Helper} from "../helper.service";

@Component({
  selector: 'app-footer-component',
  templateUrl: './footer-component.component.html',
  styleUrls: ['./footer-component.component.css']
})
export class FooterComponentComponent implements OnInit {

  message:string;
  constructor(private helper:Helper) { }

  ngOnInit() {
      this.helper.showNotificationBarEvent.subscribe((value)=>{
        this.message = value.message;
        this.myFunction();
      });
  }

 myFunction() {
  var x = document.getElementById("snackbar");
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

}
