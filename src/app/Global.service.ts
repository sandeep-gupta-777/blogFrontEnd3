import {BlogComment, BlogPost, CriteriaObject, SiteUser} from "./models";
import {Helper} from "./helper.service";
import {Injectable, OnInit} from "@angular/core";
import {EventService} from "./event.service";
@Injectable()
export class Global{

  constructor(private eventService:EventService){

    console.log('global init');
    this.eventService.setLoggedInUserDetailsEvent.subscribe(
      (value) => {
        this._loggedInUserDetails = value;
      });

  }
  private _loggedInUserDetails:SiteUser;
  private _seachQuery:string;
  // private _backendURL_heroku = 'https://shielded-harbor-17443.herokuapp.com';
  private _backendURL_heroku = 'http://localhost:3000';
  //backend routes
  public _backendRoute_AllResults = 'allresults';

  public resultsArray: [BlogPost];
  public blogCommentsArray: BlogComment[];

  public previousSRPURL ;
  public previousSRPQueryParams ;
  public previousURL:String="allresults";

  // criteriaObject:CriteriaObject={searchQuery:this.getSearchQuery(),requestType:'POST',user_id:this.getLoggedInUserDetails()._id};

  getCriteriaObject():CriteriaObject{
   let criteriaObject:CriteriaObject={searchQuery:this.getSearchQuery() || '',
     requestType:'POST',user_id:this.getLoggedInUserDetails()?this.getLoggedInUserDetails()._id :'dont know'};
    return criteriaObject;
  }
  getPreviousSRPURL(){
    return this.previousSRPURL;
  }
  setPreviousSRPURL(previousSRPURL){
    this.previousSRPURL = previousSRPURL;
  }



  getResultsArray(){
    return this.resultsArray;
  }
  setResultsArray(resultsArray:[BlogPost]){
    this.resultsArray = resultsArray;
  }

  getSearchQuery(){
    return this._seachQuery;
  }
  setSearchQuery(str){
    this._seachQuery = str;
  }


  getLoggedInUserDetails() {
    // console.log(this._loggedInUserDetails);
    return this._loggedInUserDetails;
  }
  setLoggedInUserDetails(loggedInUser) {
    this._loggedInUserDetails = loggedInUser;
  }


  getbackendURL_heroku(){
    return this._backendURL_heroku;
  }
  setbackendURL_heroku(str){
    this._backendURL_heroku = str;
  }

}


