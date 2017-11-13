import { Component, OnInit } from '@angular/core';
import {Helper} from "../helper.service";
import {BlogPost} from "../models";
import {ActivatedRoute, Router} from "@angular/router";
import {Shared} from "../shared.service";
import {Global} from "../Global.service";

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {

  constructor(public helper:Helper, public activatedRoute:ActivatedRoute, public sharedService:Shared, public router:Router, public global:Global) { }
  // localStorageTabsObj = this.populateLocalStorageTabsObj();
  tabsArray = this.populateLocalStorageTabsArray();
  ngOnInit() {
    this.helper.localstorageTabsArrayUpdatedEvent.subscribe(()=>{
      this.tabsArray = this.populateLocalStorageTabsArray();
    });
  }

  populateLocalStorageTabsArray(){
    return JSON.parse(localStorage.getItem('tabs'))&& JSON.parse(localStorage.getItem('tabs')).tabArray;;
  }

  openBlogDisplayPage(blogPost:BlogPost){
    this.global.previousSRPURL = window.location.pathname;
    this.global.previousSRPQueryParams = this.activatedRoute.snapshot.queryParams;
    // debugger;
    this.router.navigateByUrl(`${this.global.blogDisplayURL  + blogPost._id}`); //TODO: use subscribe and execute rest of the code in it
    setTimeout(()=>{
      /*why this is needed?
       we want below code to execute AFTER component is finished loading; this.showSidePanel = true will start the loading
       putting in set time out will make the code ASYNC*/
      this.sharedService.getClickedBlogPost.emit(blogPost);
    }, 0);

  }
  addActiveClass(blogPost:BlogPost){
    if(!blogPost)
      return false;
    return location.pathname === "/other/blogdisplay/"+ blogPost._id;;
  }

  removeBlogPostFromTabsArray(blogPost:BlogPost){
    this.tabsArray.forEach((value, index)=>{
      if(value._id===blogPost._id){
        this.tabsArray.splice(index,1)
      }
    });

    localStorage.setItem('tabs',JSON.stringify({tabArray:this.tabsArray}))
  }

}
