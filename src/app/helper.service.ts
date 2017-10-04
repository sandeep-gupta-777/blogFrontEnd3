/**
 * Created by sandgup3 on 17/06/2017.
 */

import {EventEmitter, Injectable} from '@angular/core';
import {Http,Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs';
import {BlogComment, CriteriaObject, ImageContainer, SiteUser} from "./models";
import {Global} from "./Global.service";
// import { Observable } from 'rxjs';

function getWindow (): any {
  // return window;
  return window;
}

function getDocument (): any {
  // return window;
  return document;
}


@Injectable()
export class Helper {
   data;
   _observableForAllImages: Observable<any>;
   // private backendURL_heroku = 'https://ffi-backend.herokuapp.com';
   private backendURL_heroku = this.global.getbackendURL_heroku();
  // private backendURL_heroku = 'http://localhost:3000';
  triggerIconGridComponentGetImagesEvent = new EventEmitter();
  showNotificationBarEvent = new EventEmitter();
  getResultEvent = new EventEmitter();
  constructor(private http: Http, private global:Global){}
  get nativeWindow (): any {
    return getWindow();
  }
  get nativeDocument (): any {
    return getDocument();
  }
  elementHeightFromTop(id, document): number{
    let ele: HTMLScriptElement = <HTMLScriptElement>document.getElementById(id);
    let x = 0;
    while (ele) {
      x += ele.offsetTop;
      ele = <HTMLScriptElement>ele.offsetParent;
    }
    return x;
  }

  triggerIconGridComponentGetImages(url: string, requestType, searchQuery?){
    console.log(searchQuery+'======================================================');
    // this.triggerIconGridComponentGetImagesEvent.emit({url,requestType,searchQuery} );
    this.getResultEvent.emit({url,requestType,searchQuery} );
  }
  triggergetResultEvent(criteriaObj:CriteriaObject){
    this.getResultEvent.emit(criteriaObj );
  }


  getData(url) {
    console.log('get data');

    if(this.data) {
      // if `data` is available just return it as `Observable`
      return Observable.of(this.data);
    }
    // else if(this._observableForAllImages) {
    //   // if `this.observable` is set then the request is in progress
    //   // return the `Observable` for the ongoing request
    //   return this._observableForAllImages;
    // }
    else {
      // example header (not necessary)
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      // create the request, store the `Observable` for subsequent subscribers
      this._observableForAllImages = this.http.get(`${this.backendURL_heroku}/${url}`)
        .map((response:Response) =>  {
          // when the cached data is available we don't need the `Observable` reference anymore
          this._observableForAllImages = null;

          if(response.status == 400) {
            return "FAILURE";
          } else if(response.status == 200) {
            console.log('inside getdata()',response);
            this.data = response.json();
            return response.json();
          }
          // make it shared so more than one subscriber can get the result
        })
        .share();
      return this._observableForAllImages;
    }
  }

  saveEditedImageContainer(imageContainer){
    let url = "saveEditedImageContainer";
    return this.http.post(`${this.backendURL_heroku}/users/${url}`, {imageContainer})//header removed
      .map((response: Response) => response.json())
      .catch((err: Response) => Observable.throw(err.json()))
  }



  findImageContainerByID(imageContainers, imageId): ImageContainer {
    for(let i=0; i <imageContainers.length ; ++i){
      if(imageContainers[i].imageId === imageId){
        return imageContainers[i];
      }
    }
  }

  getAllIcons(){
    console.log('getting all icons', this._observableForAllImages);
    return this._observableForAllImages =  this.http.get(`${this.backendURL_heroku}/AllIcons`).map( (response: Response)=> {
      console.log('getting all icons', this._observableForAllImages);
      return response.json();
    })
}

  makeGetRequestForFaceBook(url){
    return this.http.get(`${this.backendURL_heroku}/${url}`)//header removed
      .map((response: Response) => response.json())
      .catch((err: Response) => Observable.throw(err.json()))
  }

  makeGetRequest(url){

   return this.http.get(`${this.backendURL_heroku}/${url}`)//header removed
      .map((response: Response) => response.json())
      .catch((err: Response) => Observable.throw(err.json()))

}
makePostRequest(url, body){
    console.log('in header--> making post request');
   return this.http.post(`${this.backendURL_heroku}/${url}`, body)//header removed
      .map((response: Response) => response.json())
      .catch((err: Response) => Observable.throw(err.json()))

}

  toggleClassEvent =  new EventEmitter();

  setKeywordIntoSearchBarEvent = new EventEmitter();
  notifyKeywordChangeEvent = new EventEmitter();

  signup(user:SiteUser){
      return this.http.post(`${this.backendURL_heroku}/users/signup`,user)
          .map((response:Response)=>response.json())
          .catch((err:Response)=> Observable.throw(err.json()));
  }
  login(user){
    return this.http.post(`${this.backendURL_heroku}/users/login`,user)
        .map((response:Response)=>response.json())
        .catch((err:Response)=> Observable.throw(err.json()));
  }

  getAllLikedImagesByUser(user_id){
    console.log('inside getAllLikedImagesByUser');
    return this.http.post(`${this.backendURL_heroku}/users/liked_images`,{user_id:user_id})
      .map((response:Response)=>response.json())
      .catch((err:Response)=> Observable.throw(err.json()));
  }
  getUsersUploadedImagesContainersFromDB(user_id){
    console.log(user_id);
    return this.http.post(`${this.backendURL_heroku}/users/uploaded`,{user_id:user_id})
      .map((response:Response)=>response.json())
      .catch((err:Response)=> Observable.throw(err.json()));
  }

  getUserBy_id(user_id){
    return this.http.post(`${this.backendURL_heroku}/users/user_details`,{user_id:user_id})
      .map((response:Response)=>response.json())
      .catch((err:Response)=> Observable.throw(err.json()));
  }
  getLoggedInUserDetails(){
    let user_id = localStorage.getItem('userID');
    return this.getUserBy_id(user_id);

  }
  loadMoreImages(searchQuery,previouslyLoadedImagesCount,newImagesToBeLoadedCount){
    return this.http.post(`${this.backendURL_heroku}/loadMore`,{searchQuery, previouslyLoadedImagesCount,newImagesToBeLoadedCount})
      .map((response:Response)=>response.json())
      .catch((err:Response)=> Observable.throw(err.json()));
  }
  loadMoreResults(searchQuery,previouslyLoadedResultsCount,newResultsToBeLoadedCount){
    return this.http.post(`${this.backendURL_heroku}/loadMoreResults`,{searchQuery, previouslyLoadedResultsCount,newResultsToBeLoadedCount})
      .map((response:Response)=>response.json())
      .catch((err:Response)=> Observable.throw(err.json()));
  }

  getSiblingBlogCommentsCount(level){
    let i=0;
    if(this.global.blogCommentsArray)
    this.global.blogCommentsArray.forEach(function (value:BlogComment, index) {
      if(value.commentLevel === level){
        ++i;
      }
    });
    return i;
  }






}
