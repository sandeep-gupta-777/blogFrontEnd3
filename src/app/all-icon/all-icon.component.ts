import { Component, OnInit } from '@angular/core';
import {Helper} from "../helper.service";
import {ImageContainer} from "../models";
import {Shared} from "../shared.service";

@Component({
  selector: 'app-all-icon',
  template: `
    
   <app-icon-grid></app-icon-grid>
    
  `,
  styles: []
})
export class AllIconComponent implements OnInit {

  imageContainer:ImageContainer;

  constructor(private helper: Helper, private shared:Shared) { }

  ngOnInit() {

    }

}
