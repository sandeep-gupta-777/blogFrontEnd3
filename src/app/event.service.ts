import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class EventService {

  constructor() { }
  setLoggedInUserDetailsEvent = new EventEmitter();

}
