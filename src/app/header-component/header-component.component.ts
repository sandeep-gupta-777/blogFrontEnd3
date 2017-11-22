import {Component,  OnInit} from '@angular/core';
import {Helper} from '../helper.service';
import {ActivatedRoute, NavigationEnd, Params, Router} from "@angular/router";
import {Global} from "../Global.service";
import {CriteriaObject} from "../models";
import {EventService} from "../event.service";
import set = Reflect.set;
import {factoryOrValue} from "rxjs/operator/multicast";

@Component({
  selector: 'app-header-component',
  templateUrl: './header-component.component.html',
  styleUrls: ['./header-component.component.css']
})
export class HeaderComponentComponent implements OnInit {

  rightArrowKeyPressed(e){
    console.log(e);
    if(e.keyCode===39 && this.checkKeywordPartialMatch(this.searchHint, this.searchQuery)){
      this.searchQuery=this.searchHint;
      this.triggerAllResultsObservable(this.searchQuery);
    }
  }
  searchIconClicked(){

    this.global.showSearchBarBoolean=!this.global.showSearchBarBoolean;
    setTimeout(()=>{document.getElementById("searchT") && document.getElementById("searchT").focus();},0)
  }
  triggerAllResultsObservable(searchQuery?:string,togggleMenu:boolean=true){
    setTimeout(this.keywordHint(),0);
    this.global.showSearchBarBoolean = true;
    if(togggleMenu)this.showMenuOnXS = !this.showMenuOnXS;
    console.log(searchQuery);
    this.searchQuery = searchQuery;
    this.criteriaObj.url = this.global._backendRoute_AllResults;
    this.criteriaObj.searchQuery=searchQuery;

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

  ngOnInit() {
    this.keywordHint();
    this.criteriaObj.source = 'from header';

    this.helper.notifyKeywordChangeEvent.subscribe(({searchQuery,source})=>{
      this.searchQuery = searchQuery;
    });
    this.eventService.setLoggedInUserDetailsEvent.subscribe(
      (value) => {
        this.userfirstName = value.fullName.split(" ")[0];
      });
     this.helper.setKeywordIntoSearchBarEvent.subscribe(
       (keyword)=> {this.searchQuery=keyword}
     );




    //Load appropriate results from server when page is loaded
    this.changeRouterSubscription = this.router.events
      .filter(event => (event instanceof NavigationEnd))
      .subscribe((routeData: any) => {

        let currentURL = routeData.url;
        console.log('checking all the routes');

        /*what does the following code do?
        * When user reloads the page...we need to show appropriate icons
        * */
         if(currentURL.indexOf('/dashboard/likedBlogs')>-1) {
            setTimeout(()=>{//may not be needed
            this.criteriaObj.url =  'users/likedBlogs';
            console.log('sending req for liked');
            this.helper.triggergetResultEvent(this.criteriaObj);

          },1000);
        }
        // else if(currentURL==='/dashboard/writtenBlogs' && !this.global.resultsArray){
        else if(currentURL.indexOf('/dashboard/writtenBlogs')>-1 && !this.global.resultsArray) {
          // alert();
          setTimeout(()=>{//may not be needed
            this.criteriaObj.url =  'users/writtenBlogs';
            this.helper.triggergetResultEvent(this.criteriaObj);
          },0);
        }
        else if(currentURL.indexOf(this.global.blogGridUrl)>-1 || currentURL==='/') {
          this.searchQuery =  this.activatedRoute.snapshot.queryParams.query || "";

          setTimeout(() => {//may not be needed
            this.criteriaObj.url =  'allresults';
            this.criteriaObj.searchQuery = this.searchQuery;
            this.criteriaObj.shouldNavigateToSRP = false;
            this.helper.notifyKeywordChangeEvent.emit({searchQuery:this.searchQuery, source:"fromHeader1"});
            this.helper.triggergetResultEvent(this.criteriaObj);
            this.changeRouterSubscription.unsubscribe();

          }, 0);
        }
         else if(currentURL.indexOf('/other/new/blog')>-1 || currentURL.indexOf('/other/blogEdit')>-1 ) {
          this.helper.showProgressBarEvent.emit(true);
         }
        this.changeRouterSubscription.unsubscribe(); //TODO: removing this will result in two inputs getting unsync. find out why
        /**Steps to reproduce above:
         * 1. go to http://localhost:4200/other/new/blog
         * 2. type something in header input
         * 3. keep typing to obnserve weird behaviour
         * */
      });
  }
//=====================LIT====================================================
  keywordHint(){
    console.log('in keyword hints');
    if(this.searchQuery==='')
    {
      this.searchHint='';
      return;
    }
    let hintArray = ['nodejs','mongoDB','angular', 'Cat Memes','blogs', 'sandeep', 'resume', 'google','mongoose','HTML','bootstrap','css', 'MEAN Stack', 'india'];
    //sort array by size
    //checking for partial Match
    let isPartialMatch:boolean=false;
    for(let i=0;i<hintArray.length;i++){
      if(this.checkKeywordPartialMatch(hintArray[i], this.searchQuery)){
        isPartialMatch=true;
        this.searchHint=hintArray[i];
        break;
      }
    }
    if(!isPartialMatch){
      this.searchHint="";
    }

  }

  checkKeywordPartialMatch(fullString:string, subString){
    return fullString.indexOf(subString)===0;
  }
  isLoggedIn(){
    return localStorage.getItem('token')!== null;
  }


    goToBlogEditPage(){
    if(!(window.location.href.indexOf('/other/new/blog')>-1 || window.location.href.indexOf('/other/blogEdit')>-1))
    {
      this.helper.showProgressBarEvent.emit(true);
    }
    if(!this.isLoggedIn()){
      this.helper.showNotificationBarEvent.emit({message:'Please log in to create blog'});
    }
    this.global.previousSRPURL = 'new/blog';
    this.global.previousSRPQueryParams = {query:''};
      this.router.navigate(['other/new/blog']);
  }

  goToLoginPage(){

    this.global.previousSRPURL = window.location.pathname;
    this.global.previousSRPQueryParams = this.activatedRoute.snapshot.queryParams;
    console.log('saved previous url');
    this.router.navigate([this.global.loginURL]);

  }
  logout(){
    localStorage.clear();
    this.global.previousSRPURL = window.location.pathname;
    this.global.previousSRPQueryParams = this.activatedRoute.snapshot.queryParams;
    this.router.navigate([this.global.loginURL]);
    this.helper.showNotificationBarEvent.emit({message:'You are logged out!'});
  };

  ngOnDestroy(): void {

    if (this.routerEventSubscription)
      this.routerEventSubscription.unsubscribe();
    if (this.changeRouterSubscription)
      this.changeRouterSubscription.unsubscribe();
  }

  showMenuOnXS=false;
  searchHint="";
  lastCallRef;
  criteriaObj:CriteriaObject =this.global.getCriteriaObject();
  changeRouterSubscription;
  headerFixed: boolean = false;
  private routerEventSubscription;
  public searchQuery:string= "";
  public userfirstName="";
  showSearchBar:boolean = true;

  constructor( public helper: Helper,private eventService:EventService, public global:Global,private activatedRoute:ActivatedRoute,
               public router: Router) {
    helper.toggleClassEvent.subscribe((HTMLClass) => {
      this.headerFixed = true;
    });
  }
  shouldShowSearchBar():boolean{
    if(window.location.pathname==='/' || window.location.pathname==='/home'){
      return true;
    }
    return this.global.showSearchBarBoolean;
    // return this.showSearchBar;
  }
}
