import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SiteUser} from "./models";
import {Helper} from "./helper.service";
import {Global} from "./Global.service";
import {EventService} from "./event.service";
// let  Prism = require('prismjs');
// import { Helper } from './helper.service';
// import {SiteUser} from "./models";
// import {Global} from "./Global.service";

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  blogContent;
  showMenu = true;
  isSmallSizeDevice=false;
  html:string;

  constructor(private helper:Helper, private eventService:EventService,private global:Global,private ref : ChangeDetectorRef){

   }



  ngOnInit(){

    // The code snippet you want to highlight, as a string
    var code = "" +
      "var data = 1;" +
      "var data = 1;" +
      "var data = 1;" +
      "var data = 1;" +
      "var data = 1;" +
      "var data = 1;" +
      "var data = 1;" +
      "var data = 1;" +
      "var data = 1;" +
      "var data = 1;" +
      "var data = 1;" +
      "var data = 1;" +
      "var data = 1;" +
      "";

// Returns a highlighted HTML string
//     var html = Prism.highlight(code, Prism.languages.javascript);
//     this.html = html;
//     console.log(html);

    if(window.screen.height>768){
      this.isSmallSizeDevice = false;
      this.showMenu = true;
    }
    else {
      this.isSmallSizeDevice = true;
      this.showMenu= false;
    }

    /*if localstorage is not empty fetch the user details and set to Global.service.ts
    this will be required when user refreshes the page*/
    // console.log(this.global.getLoggedInUserDetails(),'from app.component');

    if(!this.global.getLoggedInUserDetails())
    {
      this.helper.getUserBy_id(localStorage.getItem('userID')).subscribe(
       (value)=> {
         console.log(value);
         this.global.setLoggedInUserDetails(value[0]);
         this.eventService.setLoggedInUserDetailsEvent.emit(value[0]);

        }
      );
    }
  }

  onBodyTextEditorKeyUp(event){

    this.blogContent = event;
    this.ref.detectChanges();
  }
}
