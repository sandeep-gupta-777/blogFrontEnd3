import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ImageContainer} from "../models";
import {Shared} from "../shared.service";
import {Helper} from "../helper.service";
import {Global} from "../Global.service";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'app-icon-grid',
  templateUrl: './icon-grid.component.html',
  styleUrls: ['./icon-grid.component.css']
})
export class IconGridComponent implements OnInit, OnDestroy{
  ngOnDestroy(): void {

    if(this.subscriptionGet)
      this.subscriptionGet.unsubscribe();
    if(this.subscriptionPost)
      this.subscriptionPost.unsubscribe();
    if(this.triggerIconGridComponentGetImagesEventSubscription)
      this.triggerIconGridComponentGetImagesEventSubscription.unsubscribe();
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
  showLoadingIcon= false;

  searchQuery;
  showLoadMore = true;
  sortbyPropery = "-imageVoteCount";
  private subscriptionGet;
  private triggerIconGridComponentGetImagesEventSubscription;
  private sharedServiceSubscription;
  private makePostRequestSubscription;
  private loadMoreImagesSubscription;
  private notifyKeywordChangeEventSubscription;
  private subscriptionPost;
  @Input() imageContainers: ImageContainer[]  = null;
  constructor(private sharedService: Shared, private helper:Helper, private global:Global) {
  }


  sortImageContainerArrayBy(property){
    this.sortbyPropery = property;
    this.imageContainers = this.imageContainers.sort(this.dynamicSort(property));
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

  loadMore(){
    /*perform search for a given query but skip all the images which have already been loaded*/
    /*if the newly loaded image count is less than the demanded => means there are no more such imagges
    * therefore, its safe to disable load more button
    * */
    console.log('load more click');
    let previouslyLoadedImagesCount,newImagesToBeLoadedCount = 40;
    previouslyLoadedImagesCount = this.imageContainers.length;
    this.showLoadingIcon = true;
    this.loadMoreImagesSubscription =  this.helper.loadMoreImages(this.searchQuery,previouslyLoadedImagesCount,newImagesToBeLoadedCount )
      .subscribe(value=>{
        this.showLoadingIcon = false;
        console.log(value);
        value.length<10?this.showLoadMore=false:this.showLoadMore=true;
        this.imageContainers = this.imageContainers.concat(value);
        this.sortImageContainerArrayBy(this.sortbyPropery);

      });

  }

  openSideImagePanel(imageContainer){
    console.log(imageContainer);
    this.showSidePanel = true;
    setTimeout(()=>{
      /*why this is needed?
      we want below code to execute AFTER component is finished loading; this.showSidePanel = true will start the loading
      putting in set time out will make the code ASYNC*/
      this.sharedService.getImageContainers.emit(imageContainer);
    }, 0);


  }

  //on clicking like
  increaseVoteCount(imageId) {
    console.log('hello');
    let imageContainer : ImageContainer = this.helper.findImageContainerByID(this.imageContainers,imageId);
    console.log(imageContainer);
    imageContainer.imageVoteCount++;//this is just for front-end
    let body = {image_id: imageContainer._id, user_id: localStorage.getItem('userID')};
    console.log(imageContainer);
      this.makePostRequestSubscription = this.helper.makePostRequest("increaseVoteCount", body)
          .subscribe(
            data => console.log(data),
            err => console.log(err)
          );
  }

  ngOnInit() {

    console.log('ngOnInIT================================================================================');


    this.sharedServiceSubscription = this.sharedService._observable.subscribe((value)=>{
      console.log(value);
     // this.imageContainers = value.imageContainers;
    });

    this.triggerIconGridComponentGetImagesEventSubscription = this.helper.triggerIconGridComponentGetImagesEvent.subscribe(({url,requestType, searchQuery})=>{
      console.log('Getting images from server, triggerIconGridComponentGetImagesEvent');
      let user_id = localStorage.getItem('userID');
      this.showLoadingIcon=true;
      if(requestType==='POST')
      {
       this.subscriptionPost = this.helper.makePostRequest(url,{user_id, searchQuery:searchQuery}).subscribe(
        (value) =>{
          this.showLoadingIcon=false;
          console.log(value);
          this.imageContainers = value;
          // alert();
          this.sortImageContainerArrayBy('-imageVoteCount');
          value.length<10?this.showLoadMore=false:this.showLoadMore=true;
        },
       //
         (error)=>{
          console.log(error);
         }

       );
      }
      else {
        this.subscriptionGet =  this.helper.makeGetRequest(url).subscribe(
          (value) =>{
            this.showLoadingIcon=false;
            console.log(value);
            this.imageContainers = value;
            this.sortImageContainerArrayBy('-imageVoteCount');
            value.length<10?this.showLoadMore=false:this.showLoadMore=true;
          });
      }

    });

    this.notifyKeywordChangeEventSubscription = this.helper.notifyKeywordChangeEvent.subscribe(value=>{
      this.searchQuery = value;
      this.global.setSearchQuery(value);
    })

  }
}

