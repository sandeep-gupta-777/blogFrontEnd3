import {NgModule} from "@angular/core";
import {SortArrayByPipe} from "./sort-array-by.pipe";
import {BlogGridComponent} from "./blog-grid/blog-grid.component";
import {CommonModule} from "@angular/common";
import {HttpModule} from "@angular/http";
import {TrimStringPipe} from "./trim-string.pipe";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {SafePipe} from "./safe.pipe";
import {CamelcasePipe} from "./camelcase.pipe";

@NgModule({
  declarations:[
    BlogGridComponent,
    SortArrayByPipe,
    TrimStringPipe,
    SafePipe,
    CamelcasePipe
  ],
  exports:[BlogGridComponent,
    SortArrayByPipe,
    TrimStringPipe,
    SafePipe,
    CamelcasePipe

  ],
  imports:[
    CommonModule,
    HttpModule,
    FormsModule,
    RouterModule
  ]
})
export class SharedModule{

}
