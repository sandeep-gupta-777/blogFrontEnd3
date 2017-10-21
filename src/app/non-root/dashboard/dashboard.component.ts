import {Component, ElementRef, OnInit} from "@angular/core";
import 'rxjs';

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
  }

  getUsersBlogs(){

    this.criteriaObj.url= 'users/writtenBlogs';
    this.helper.triggergetResultEvent(this.criteriaObj);
    console.log('get dirty blogs');
    this.highlightTab = 'My Blogs';
  }

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
    debugger;
    if(currentURL===this.global.dashboardURL){
      this.highlightTab = 'dashboard';
      alert();
    }
    else if(currentURL===this.global.likedBlogsURL){
        this.highlightTab = 'Liked';
    }
    else if(currentURL===this.global.writtenBlogsURL ){
      this.highlightTab = 'My Blogs';
    }
    else if(currentURL===this.global.draftsURL ){
      this.highlightTab = 'drafts';
    }

  }
}
