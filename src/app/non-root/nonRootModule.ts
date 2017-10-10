


import {NgModule} from "@angular/core";
import {LoginComponent} from "./login/login.component";
import {SignupComponent} from "./signup/signup.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {TagsInputDirective} from "./tagsinput/tagsinput.component";
import {BlogPageComponent} from "./blog-page/blog-edit.component";
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

const appRoutes: Routes = [
  {component: LoginComponent, path: 'login'},
  {component: LoginComponent, path: 'login/:nextURL'},
  {component: SignupComponent, path: 'signup'},
  {component: SignupComponent, path: 'signup/:nextURL'},
  {component: DashboardComponent, path: 'dashboard',canActivate:[AuthService], children: [
    {component: BlogGridComponent, path: 'Drafts'},
    {component: BlogGridComponent, path: 'likedBlogs'},
    {component: BlogGridComponent, path: 'writtenBlogs'},
    {component: BlogGridComponent, path: 'upload'}
  ]},
  {component: BlogDisplayComponent, path: 'blogdisplay/:id'},
  {component: TextEditorInterfaceComponent, path: 'new/blog',canActivate:[AuthService]},
  {component: TextEditorInterfaceComponent, path: 'blogEdit',canActivate:[AuthService]},
  {component: TextEditorInterfaceComponent, path: 'blogEdit/:id',canActivate:[AuthService]},
];



@NgModule({
  declarations:[
    LoginComponent,
    SignupComponent,
    BlogGridComponent,
    DashboardComponent,
    TagsInputDirective,
    BlogPageComponent,
    BlogDisplayComponent,
    TextEditorInterfaceComponent,
    SortArrayByPipe,
    ThreadComponent,
    CommentComponent,
    TrimStringPipe,
  ],
  exports:[SortArrayByPipe],
  imports:[
    CommonModule,
    FormsModule,
    HttpModule,
    RouterModule.forChild(appRoutes )
  ]

})

export class NonRootModule{

}
