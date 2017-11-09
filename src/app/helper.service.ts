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
   private backendURL_heroku = this.global.getbackendURL_heroku();
  showNotificationBarEvent = new EventEmitter();
  showProgressBarEvent = new EventEmitter<boolean>();
  getResultEvent = new EventEmitter();
  constructor(private http: Http, private global:Global){}

  triggergetResultEvent(criteriaObj:CriteriaObject){
    this.getResultEvent.emit(criteriaObj );
  }

  makeGetRequest(url){

   return this.http.get(`${this.backendURL_heroku}/${url}`)//header removed
      .map((response: Response) => response.json())
      .catch((err: Response) => Observable.throw(err.json()))

}

makePostRequest(url, body){
    console.log('in header--> making post request');
    body.user_id = this.global.getLoggedInUserDetails() && this.global.getLoggedInUserDetails()._id;
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

  getUserBy_id(user_id){
    return this.http.post(`${this.backendURL_heroku}/users/user_details`,{user_id:user_id})
      .map((response:Response)=>response.json())
      .catch((err:Response)=> Observable.throw(err.json()));
  }
  getLoggedInUserDetails(){
    let user_id = localStorage.getItem('userID');
    return this.getUserBy_id(user_id);

  }
  loadMoreResults(searchQuery,previouslyLoadedResultsCount,newResultsToBeLoadedCount){
    return this.http.post(`${this.backendURL_heroku}/loadMoreResults`,{searchQuery, previouslyLoadedResultsCount,newResultsToBeLoadedCount})
      .map((response:Response)=>{
        return response.json();//if return is not there, rubscribe will get undefind
        //TODO: learn why do we require return in above line: https://stackoverflow.com/questions/44750337/angular-2-subscribe-returning-undefined
      })
      // .catch((err:Response)=> Observable.throw(err.json()));
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

  makeGetRequestForFaceBook(url){
    return this.http.get(`${this.backendURL_heroku}/${url}`)//header removed
      .map((response: Response) => response.json())
      .catch((err: Response) => Observable.throw(err.json()))
  }




}
