


import {NgModule} from "@angular/core";
import {LoginComponent} from "./login/login.component";
import {SignupComponent} from "./signup/signup.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {TagsInputDirective} from "./tagsinput/tagsinput.component";
import {BlogPageComponent} from "./blog-Edit/blog-edit.component";
import {BlogDisplayComponent} from "./blog-display/blog-display.component";
import {TextEditorInterfaceComponent} from "./text-editor-interface/text-editor-interface.component";
import {SortArrayByPipe} from "../sort-array-by.pipe";
import {ThreadComponent} from "./thread/thread.component";
import {CommentComponent} from "./comment/comment.component";
import {TrimStringPipe} from "../trim-string.pipe";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {BlogGridComponent} from "../blog-grid/blog-grid.component";
import {AuthService} from "../auth.service";
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../sharedModule";

const appRoutes: Routes = [
  {component: LoginComponent, path: 'login'},
  {component: LoginComponent, path: 'login/:nextURL'},
  {component: SignupComponent, path: 'signup'},
  {component: SignupComponent, path: 'signup/:nextURL'},
  {component: DashboardComponent, path: 'dashboard', children: [//TODO: add canActivate in routes
    {component: BlogGridComponent, path: 'drafts'},
    {component: BlogGridComponent, path: 'likedBlogs'},
    {component: BlogGridComponent, path: 'writtenBlogs'},
    {component: BlogGridComponent, path: 'upload'}
  ]},
  {component: BlogDisplayComponent, path: 'blogdisplay/:id'},
  {component: TextEditorInterfaceComponent, path: 'new/blog'},
  {component: TextEditorInterfaceComponent, path: 'blogEdit'},
  {component: TextEditorInterfaceComponent, path: 'blogEdit/:id'},
];



@NgModule({
  declarations:[
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    TagsInputDirective,
    BlogPageComponent,
    BlogDisplayComponent,
    TextEditorInterfaceComponent,
    ThreadComponent,
    CommentComponent,
  ],
  imports:[
    CommonModule,
    RouterModule.forChild(appRoutes ),
    SharedModule,
    HttpModule,
    FormsModule
  ]

})

export class NonRootModule{

}
