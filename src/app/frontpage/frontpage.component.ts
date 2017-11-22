import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {Global} from "../Global.service";
import {Helper} from "../helper.service";

@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.component.html',
  styleUrls: ['./frontpage.component.css']
})
export class FrontpageComponent implements OnInit {

  constructor(public router:Router, private global:Global, public helper:Helper) { }

  searchQuery="";
  changeRouterSubscription;
  criteriaObj:any={};
  ngOnInit() {
  }
  // triggerAllResultsObservable(){
  //   console.log('hi');
  //   this.global.setSearchQuery(this.searchQuery);
  //     this.router.navigate([this.global.blogGridUrl], {queryParams:{query:this.searchQuery}});
  // }


  triggerAllResultsObservable(searchQuery?:string){
    // if(togggleMenu)this.showMenuOnXS = !this.showMenuOnXS;
    console.log(searchQuery);
    this.searchQuery = searchQuery;
    this.criteriaObj.url = this.global._backendRoute_AllResults;
    this.criteriaObj.searchQuery=searchQuery;
    this.criteriaObj.requestType='POST'

    this.global.setSearchQuery(searchQuery);
    this.helper.notifyKeywordChangeEvent.emit({searchQuery:this.searchQuery, source:"fromHeader"});

    //navigate to http://localhost:4200/icons page is not already navigated
    if(this.router.url !== "/"+this.global.blogGridUrl)//these are frontend routes but with same value
    {
      this.router.navigate(["/" + this.global.blogGridUrl], {queryParams: {query: searchQuery}});
      this.changeRouterSubscription = this.router.events
        .filter(event => (event instanceof NavigationEnd))
        .subscribe((routeData: any) => {

          setTimeout(()=>{
            // console.log(t);
            this.helper.getResultEvent.emit(this.criteriaObj );
            this.changeRouterSubscription.unsubscribe();
          },0);
        });
    }
    else {
      console.log(this.criteriaObj);
      this.helper.triggergetResultEvent(this.criteriaObj);
    }

  }

}
