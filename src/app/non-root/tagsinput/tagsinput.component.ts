
import 'bootstrap-tagsinput';

import {Directive, ElementRef} from "@angular/core";

@Directive({
  selector: `[tagsinput]`
})
export class TagsInputDirective {
  //https://medium.com/@NetanelBasal/typescript-integrate-jquery-plugin-in-your-project-e28c6887d8dc
  constructor(private el: ElementRef) {
    // (<any>jquery(this.el.nativeElement)).daterangepicker();
    // (<any>jquery(this.el.nativeElement)).tagsinput('items');
  }
  ngAfterViewInit() {
    (<any>jQuery(this.el.nativeElement)).tagsinput(['sabdeep',"gupta"]);
  }
}
