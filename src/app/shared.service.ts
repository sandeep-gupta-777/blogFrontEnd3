import { Observable } from 'rxjs/Observable';
import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ImageContainer} from "./models";
import {Http,Response} from '@angular/http';
@Injectable()
export class Shared {
  constructor(private http:Http){

  }
  imageContainer: ImageContainer;
  // Observable string sources
  private emitChangeSource = new BehaviorSubject<any>({});

  // Observable string streams
  _observable = this.emitChangeSource.asObservable();
  // Service message commands
  emitChange(change: any) {
    this.emitChangeSource.next(change);
  }


  //===========================================================

  //===========Event emmiter below
  getImageContainers = new EventEmitter();
  getClickedBlogPost = new EventEmitter();


}
