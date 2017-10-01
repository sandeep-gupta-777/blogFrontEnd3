import {Component, OnInit, ViewChild} from '@angular/core';
import {Helper} from "../../helper.service";
import {Global} from "../../Global.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-screen1-component',
  templateUrl: './main-screen-component.component.html',
  styleUrls: ['./main-screen-component.component.css']
})
export class MainScreenComponentComponent implements OnInit {

  @ViewChild('searchT') searchBox;
  searchQuery="";
  constructor (private helper: Helper,private global :Global,private router:Router) { }


  ngOnInit() {

  }
  performSearch(){
    //set up the global parameter
    this.global.setSearchQuery(this.searchQuery);

    /*upon navigating to /icon, this.helper.triggerIconGridComponentGetImages('AllIcons','POST',  this.global.getSearchQuery())
    will be fired by header-component.component.ts*/
    if(this.router.url !== '/icons')
      this.router.navigate(['/icons']);
    this.helper.setKeywordIntoSearchBarEvent.emit(this.searchQuery);

  };



}
