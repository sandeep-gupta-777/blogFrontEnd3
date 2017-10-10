import {Component, ElementRef, OnInit} from "@angular/core";
// import {  FileUploader } from 'ng2-file-upload/ng2-file-upload';
import 'rxjs';
import { Observable } from "rxjs";
// import {userInfo} from "os";
// const URL = 'https://ffi-backend.herokuapp.com/upload';
// const URL = 'http://localhost:3000/upload';

import { CriteriaObject} from "../../models";
import { Response } from '@angular/http';
import {Shared} from "../../shared.service";
import {Helper} from "../../helper.service";
import {Global} from "../../Global.service";
import {Http} from "@angular/http";

@Component({
    selector: 'app-dashboard',
    templateUrl:'./dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})


export class DashboardComponent implements OnInit{

  imageContainers = null;
  user_id = localStorage.getItem("userID");
  uploadBoxOpen = false;
  upload_status = "";
  URL = this.global.getbackendURL_heroku();
  highlightTab;
  criteriaObj:CriteriaObject =this.global.getCriteriaObject();
  constructor (private helper: Helper, private sharedService: Shared,private http:Http, private el: ElementRef,private global:Global){
      // this.getUsersImage();
  }


  // public uploader:FileUploader = new FileUploader({url: URL, itemAlias: 'photo'});


  getImagesUploadedByUser(){

    this.helper.getAllLikedImagesByUser(this.user_id).subscribe( (value) => {

      this.imageContainers = value.imageContainers;
      console.log(this.imageContainers);
    })
  }
  // getUsersImage(){
  //   this.helper.triggerIconGridComponentGetImages('users/uploaded','POST');
  // }
  getUsersBlogs(){

    this.criteriaObj.url= 'users/writtenBlogs';
    this.helper.triggergetResultEvent(this.criteriaObj);
    console.log('get dirty blogs');
    this.highlightTab = 'My Blogs';
  }

  //get all liked images by user
  // getAllLikedImages(){
  //   this.helper.triggerIconGridComponentGetImages('users/liked_images','POST','from dashboard');
  //
  // }
  //get all liked images by user
  getAllLikedBlogs(){
    this.criteriaObj.url= 'users/likedBlogs';
    this.helper.triggergetResultEvent(this.criteriaObj);
    this.highlightTab = 'Liked';

  }
  getAllDirtyBlogs(){
    this.criteriaObj.url = 'users/dirtyBlogs';
    this.helper.triggergetResultEvent(this.criteriaObj);
    this.highlightTab = 'Drafts';
  }



  //=============================================================================


  upload1() {
    //locate the file element meant for the file upload.
    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photo');
    //get the total amount of files attached to the file input.
    let fileCount: number = inputEl.files.length;
    //create a new fromdata instance
    let formData = new FormData();
    console.log('in upload method');
    console.log(inputEl.files.item(0));
    // check if the filecount is greater than zero, to be sure a file was selected.
    if (fileCount > 0) { // a file was selected
      //append the key name 'photo' with the first file in the element
      formData.append('photo', inputEl.files.item(0));
      formData.append('imageAuthor_id', this.global.getLoggedInUserDetails()._id);
      formData.append('imageAuthor', this.global.getLoggedInUserDetails().fullName);
      //call the angular http method
      this.http
      //post the form data to the url defined above and map the response. Then subscribe //to initiate the post. if you don't subscribe, angular wont post.
        .post(this.URL+'/upload', formData)
        .map((response: Response) => response.json())
        .subscribe(
        //map the success function and alert the response
        (success) => {
          this.upload_status = `${success} uploaded` ;
          console.log(success);
        },
        (error) => {
          this.upload_status = `error with ${error} ` ;

        })
    }
    else {
      alert('No file chosen');
    }
  }

  //============================

  ngOnInit(): void {
    this.criteriaObj.source = "from dashboard";
    let currentURL= window.location.pathname;
    if(currentURL==='/icons'){
      setTimeout(()=>{//may not be needed
        this.helper.triggerIconGridComponentGetImages('AllIcons','POST',  this.global.getSearchQuery());
      },0);
    }
    else if(currentURL==='/dashboard/likedBlogs'){
        this.highlightTab = 'Liked';
    }
    else if(currentURL==='/dashboard/writtenBlogs' ){
      this.highlightTab = 'My Blogs';
    }

  //   this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
  //     form.append('imageAuthor_id', this.user_id);
  //     form.append('imageAuthor', "sandeep ggguu");
  //   };
  //
  //   //override the onAfterAddingfile property of the uploader so it doesn't authenticate with //credentials.
  //   this.uploader.onAfterAddingFile = (file)=> { file.withCredentials = false; };
  //
  //   //overide the onCompleteItem property of the uploader so we are
  //   //able to deal with the server response.
  //   this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
  //     console.log("ImageUpload:uploaded:", item, status, response);
  //   };
  }
}
