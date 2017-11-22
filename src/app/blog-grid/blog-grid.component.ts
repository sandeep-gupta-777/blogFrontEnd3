import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BlogPost, CriteriaObject, ImageContainer} from "../models";
import {Shared} from "../shared.service";
import {Helper} from "../helper.service";
import {Global} from "../Global.service";
import {ActivatedRoute, Router} from "@angular/router";
import {isUndefined} from "util";
import {Observable} from "rxjs/Observable";
import {Http} from "@angular/http";
import {map} from "rxjs/operator/map";

@Component({
  selector: 'app-blog-grid',
  templateUrl: './blog-grid.component.html',
  styleUrls: ['./blog-grid.component.css']
})
export class BlogGridComponent implements OnInit {



  lastCall;

  triggerAllResultsObservable(searchQuery?:string){
    this.helper.notifyKeywordChangeEvent.emit({searchQuery:searchQuery,source:"fromBlogGrid"});
console.log("hello");
    //navigate to http://localhost:4200/icons page is not already navigated
    if(this.router.url !== "/"+this.global.blogGridUrl)//these are frontend routes but with same value
      this.router.navigate(["/"+ this.global.blogGridUrl]);
    // if (!isUndefined(searchQuery)) {
      this.searchQuery = searchQuery;
      this.global.setSearchQuery(searchQuery);
    // }

    setTimeout(()=>{
      this.criteriaObj.searchQuery = searchQuery;
      this.criteriaObj.url = this.global.blogGridUrl;
      this.helper.triggergetResultEvent(this.criteriaObj);
    }, 0);
    // this.helper.triggerIconGridComponentGetImages('AllIcons','POST',  newValue);
  }



  test(){
    console.log(this.resultsArray);
    return this.resultsArray;
  }


  showTimeOutErrorIfNeeded(){
    this.showTimeoutError = true;
    this.timeOutRef = setTimeout(()=>{
      this.showTimeoutError = false;
      this.loadMoreResultsSubscription.unsubscribe();
    },3000);
  }

  loadMore(){
    /*perform search for a given query but skip all the images which have already been loaded*/
    /*if the newly loaded image count is less than the demanded => means there are no more such imagges
     * therefore, its safe to disable load more button
     * */

    let previouslyLoadedResultCount=0,newResultsToBeLoadedCount = 10;
    console.log('load more clicked');
    this.showLoadingIcon = true;
    this.showTimeOutErrorIfNeeded();
    // this.loadMoreResultsSubscription =
      this.helper.loadMoreResults(this.searchQuery,this.previouslyLoadedResultCount,this.newResultsToBeLoadedCount )
      .subscribe(value=>{
        console.log(value);
        clearInterval(this.timeOutRef);
        this.showLoadingIcon = false;
        value.length<newResultsToBeLoadedCount?this.showLoadMore=false:this.showLoadMore=true;//TODO: change 1 to  10
        this.resultsArray = this.resultsArray.concat(value);
        this.previouslyLoadedResultCount = this.resultsArray.length ;
        ////this.sortResultsArrayBy(this.sortbyPropery); we are not sorting....we should recieve sorted queries
      });

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


  ngOnInit() {
    // alert('grid-ngoninit');
    this.searchQuery= this.global.getSearchQuery();
    this.criteriaObj.source= 'from blog grid';
    // debugger;
    let tempUrl = window.location.href;
    if(tempUrl.indexOf('parent=dashboard')>-1)//TODO: change this to something more robust
    {
      this.parent='dashaboard';
      // this.router.navigate(['allresults'],{queryParams:{query:searchQuery}});
    }
    else {
      this.parent="";
    }
    this.resultsArray = this.global.resultsArray;
  this.sharedServiceSubscription = this.sharedService._observable.subscribe((value)=>{
    });

  // console.log('just before the subscription');
    //TODO: check if this can be moved to helper function
    this.triggerGetResultsEventSubscription = this.helper.getResultEvent.debounceTime(500)
      // .distinctUntilChanged() is not working properly
      .subscribe((criteriaObj:any)=>{//change any to CriteriaObj

      this.helper.showProgressBarEvent.emit(true);
      criteriaObj.searchQueryTimeStamp=Date.now();
      if(this.global.getLoggedInUserDetails())
      criteriaObj.user_id = this.global.getLoggedInUserDetails()._id;
      this.showLoadingIcon=true;

      //change the url accordingly, but not if blog-grid.component.ts is child component
        if(tempUrl.indexOf('parent=dashboard')>-1)//TODO: change this to something more robust
        {
          this.parent='dashaboard';
        }
        // else if(tempUrl.indexOf('allresults')>-1){
        //   this.parent='';
        //   this.router.navigate(['allresults'],{queryParams:{query:criteriaObj.searchQuery}});
        // }
        else if(tempUrl.indexOf('/app/allresults?query')) {
          this.parent='';
          this.router.navigate(['app','allresults'],{queryParams:{query:criteriaObj.searchQuery}});//TODO: change this
        }
      // }

      if(criteriaObj.requestType==='POST')
      {
        if(!criteriaObj.searchQueryTimeStamp) criteriaObj.searchQuery ="";
        // console.log('subscribing to make post req');
        this.subscriptionPost = this.helper.makePostRequest(criteriaObj.url,criteriaObj).subscribe(

          (value:any) =>{

            if(this.global.getSearchQuery()===this.searchQuery){
              this.helper.showProgressBarEvent.emit(false);
            }
            else {
              this.helper.showProgressBarEvent.emit(true);
            }
            console.log('recieved results from server',value.value.searchQuery);

            if(value.searchQueryTimeStamp< this.searchQueryTimeStamp){
              console.log('old search...discarded');
              return;
            }
            this.searchQueryTimeStamp = value.searchQueryTimeStamp;
            value = value.value;
            this.showLoadingIcon=false;
            // this.imageContainers = value;
            this.resultsArray = value;
            // this.sortImageContainerArrayBy('-imageVoteCount');
            this.sortResultsArrayBy(this.sortbyPropery);//change here
            // value.length<10?this.showLoadMore=false:this.showLoadMore=true;
            value.length<1?this.showLoadMore=false:this.showLoadMore=true;//TODO: change 1 to 10

            this.global.resultsArray = value;
          },
          //
          (error)=>{
            console.log(error);
          }

        );
      }

    });

    this.notifyKeywordChangeEventSubscription = this.helper.notifyKeywordChangeEvent.subscribe(value=>{
      console.log( "inside notifyKeywordChangeEvent");
      this.global.setSearchQuery(value.searchQuery);
      if(value.source==="fromBlogGrid")
        return;
      this.searchQuery = value.searchQuery;

    })

  }


//=======================LIT=================

  isUserAlsoOwnerOfThisBlogPost(imageAuthor_id){
    //TODO: this method is called by 4 time, debug it
    let temp = this.global.getLoggedInUserDetails();
    if(!temp) return false;
    return imageAuthor_id ===this.global.getLoggedInUserDetails()._id;
  }
  sortResultsArrayBy(property){
    this.sortbyPropery = property;
    this.resultsArray = this.resultsArray.sort(this.dynamicSort(property));
  }
  dynamicSort(property:string) {
    let sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }
  ngOnDestroy(): void {

    if(this.subscriptionGet)
      this.subscriptionGet.unsubscribe();
    if(this.subscriptionPost)
      this.subscriptionPost.unsubscribe();
    if(this.triggerGetResultsEventSubscription)
      this.triggerGetResultsEventSubscription.unsubscribe();
    if(this.sharedServiceSubscription)
      this.sharedServiceSubscription.unsubscribe();
    if(this.makePostRequestSubscription)
      this.makePostRequestSubscription.unsubscribe();
    if(this.loadMoreImagesSubscription)
      this.loadMoreImagesSubscription.unsubscribe();
    if(this.notifyKeywordChangeEventSubscription)
      this.notifyKeywordChangeEventSubscription.unsubscribe();
  }
  showSidePanel = false;
  showLoadingIcon = false;
  showTimeoutError = false;
  searchQuery;
  showLoadMore = true;
  sortbyPropery = "-blogRelevency";
  private subscriptionGet;
  private triggerGetResultsEventSubscription;
  private sharedServiceSubscription;
  private makePostRequestSubscription;
  private loadMoreImagesSubscription;
  private loadMoreResultsSubscription;
  private notifyKeywordChangeEventSubscription;
  previouslyLoadedResultCount = 0;
  newResultsToBeLoadedCount = 10;//TODO: make it a global variable
  private subscriptionPost;
  resultsArray: BlogPost[];
  loadingArray = [1, 2,3,4,5,6,7,8,9,0];
  searchQueryTimeStamp;
  parent;
  timeOutRef;
  criteriaObj:CriteriaObject =this.global.getCriteriaObject();


  constructor(private sharedService: Shared, private http: Http, private helper: Helper, public global: Global, private router: Router, private activatedRoute: ActivatedRoute) {
  }
}
