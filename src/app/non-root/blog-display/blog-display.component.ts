import {ChangeDetectorRef, Component, ElementRef, OnInit} from '@angular/core';
import * as jquery from "jquery";
import {ActivatedRoute, Route, Router} from "@angular/router";
import {BlogPost, CriteriaObject, ImageContainer} from "../../models";
import {Shared} from "../../shared.service";
import {Helper} from "../../helper.service";
import {Global} from "../../Global.service";

@Component({
  selector: 'app-blog-display',
  templateUrl: './blog-display.component.html',
  styleUrls: ['./blog-display.component.css']
})
export class BlogDisplayComponent implements OnInit {

  ngOnDestroy(): void {

    if (this.getClickedBlogPostSubscription)
      this.getClickedBlogPostSubscription.unsubscribe();
    if (this.makePostRequestSubscription)
      this.makePostRequestSubscription.unsubscribe();
  }

  editMode = false;
  privateMode= 0;
  privateModeButtonText= "Make Public";
  togglePrivateMode(){
    console.log(this.privateMode);
    ++this.privateMode;
    if(this.privateMode%2===0)
    {
      this.privateModeButtonText="Public";
    }
    else {
      this.privateModeButtonText="Private";
    }

    this.helper.makePostRequest('users/togglePrivateMode',{_id:this.blogPost._id}).subscribe((value:any)=>{

    });
  }

  // private getImageContainersSubscription;
  getClickedBlogPostSubscription;
  makePostRequestSubscription;

  blogPost: BlogPost = {
    blogTitle:"loading...",
    blogHTML:"loading...",
    blogDraftHTML:"loading...",
    blogText:"loading...",
    blogAuthor_id:"loading...",
    blogAuthor_fullName:"loading...",
    blogCreationDate:new Date(),
    blogLastUpdatedDate:new Date(),
    blogLikes:["asdasd"],
    blogViews:-1,
    blogComments:["loading..."],
    blogTags:["loading..."],
    blogRelevency:-1,
    blogImageURL: "loading...",
    blogPrivateMode:0
  };
  blogTitle = "not set";
  _id;
  criteriaObj:CriteriaObject =this.global.getCriteriaObject();

  constructor(private shared: Shared, private el: ElementRef, private helper: Helper, public global: Global, private router: Router,
              private route: ActivatedRoute,private ref : ChangeDetectorRef) {

  }

  goToPreviousSRP(){
    this.router.navigate([this.global.previousSRPURL],{queryParams:this.global.previousSRPQueryParams});
  }

  // isUserAlsoOwnerOfThisImage(imageAuthor_id){
  //   //TODO: this method is called by 4 time, debug it
  //   let temp = this.global.getLoggedInUserDetails();
  //   if(!temp) return false;
  //   console.log(' in isUserAlsoOwnerOfThisImage');
  //   return imageAuthor_id ===this.global.getLoggedInUserDetails()._id;
  // }

  //fine
  isUserAlsoOwnerOfThisBlogPost() {
    //TODO: this method is called by 4 time, debug it
    let temp = this.global.getLoggedInUserDetails();
    // console.log(temp);
    if (!(temp && this.blogPost)) return false;
    return this.blogPost.blogAuthor_id === this.global.getLoggedInUserDetails()._id;
  }

  triggerGetResultEvent(searchQuery) {//TODO: this exact same method is written in header, put it in helper file

    //navigate to http://localhost:4200/icons page is not already navigated
    if(this.router.url !== "/"+this.global._backendRoute_AllResults)//these are frontend routes but with same value
      this.router.navigate(["/"+ this.global._backendRoute_AllResults],{queryParams:{query:searchQuery}});

    setTimeout(()=>{
      this.helper.notifyKeywordChangeEvent.emit(searchQuery);
      this.criteriaObj.url = this.global._backendRoute_AllResults;
      this.helper.triggergetResultEvent(this.criteriaObj);
    }, 0);
  }

  toggleEditModeAndSave() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      // this.makeTagsEditable();
    }
    else {
      //make a call to save this object
    }

  }


  openBlogEditorPage() {
    // this.showSidePanel = true;
    this.router.navigateByUrl(this.global.blogEditURL+this.blogPost._id); //TODO: use subscribe and execute rest of the code in it

    setTimeout(() => {
      /*why this is needed?
       we want below code to execute AFTER component is finished loading; this.showSidePanel = true will start the loading
       putting in set time out will make the code ASYNC*/
      this.shared.getClickedBlogPost.emit(this.blogPost);
    }, 0);
  }


  ngOnInit(): void {
    this.criteriaObj.source = 'from blog display';

     this._id = this.route.snapshot.params['id'];

    // this.getImageContainersSubscription = this.shared.getImageContainers.subscribe(
    //   (value)=>{
    //     console.log("in ng on init of sidebar1.component.ts");
    //     this.imageContainer = value
    //   }
    // );
    this.getClickedBlogPostSubscription = this.shared.getClickedBlogPost.subscribe(
      (value) => {
        console.log(value);
        this.blogPost = value;
      }
    );

    // let user_id= this.global.getLoggedInUserDetails() && this.global.getLoggedInUserDetails()._id;//bad idea
    //this code is to fetch the blog from server when page is reloaded
    this.helper.makePostRequest('getBlogPost', {_id: this._id}).subscribe((value) => {
      this.blogPost = value[0];

      this.pushBlogInLocalStorageObj();

      // alert(this.blogPost.blogTitle);
      this.blogTitle = this.blogPost.blogTitle;
      this.privateMode = this.blogPost.blogPrivateMode;
      if(this.privateMode%2===0)
      {
        this.privateModeButtonText="Public";
      }
      else {
        this.privateModeButtonText="Private";
      }
      console.log(value[0]);
      this.ref.detectChanges();

    });
  }


  toggleLike(){
    /*likes should be an array
    * toggle users id is found in that array
    * */
    let user_id = this.global.getLoggedInUserDetails()._id;
    let operation;
    let indexOfUserIDInLikedArry;
    if(this.blogPost.blogLikes)
    {
      indexOfUserIDInLikedArry = this.blogPost.blogLikes.indexOf(user_id);

    }
    else {
      this.blogPost.blogLikes = ['asdasd'];
    }
    if(indexOfUserIDInLikedArry===-1){
      this.blogPost.blogLikes.push(user_id);
      operation = "push";
    }
    else {
      this.blogPost.blogLikes.splice(indexOfUserIDInLikedArry,1);
      operation = "pull";
    }
    //TODO: save in databse
    let body = {blogPost_id: this.blogPost._id, user_id: user_id, operation:operation};
    this.makePostRequestSubscription = this.helper.makePostRequest("toggleLike", body)
      .subscribe(
        data => console.log(data),
        err => console.log(err)
      );

  }
  pushBlogInLocalStorageObj(){
    debugger;
    let tempTabObject={tabArray:[this.blogPost]};
    if(!localStorage.getItem('tabs')){
      localStorage.setItem('tabs',JSON.stringify(tempTabObject));
    }
    else {

      let localStorageObject = JSON.parse(localStorage.getItem('tabs'));
      let duplicate:boolean=false;
      localStorageObject.tabArray.forEach((value)=>{
        if(value._id===this.blogPost._id){
          duplicate=true;
        }
      });
      if(!duplicate && this.blogPost._id){
        localStorageObject.tabArray.unshift(this.blogPost);
        localStorage.setItem('tabs',JSON.stringify(localStorageObject));
        this.helper.localstorageTabsArrayUpdatedEvent.emit();
      }

    }
  }

}
