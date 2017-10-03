import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RouterModule, Routes} from "@angular/router";

import { AppComponent } from './app.component';

import { HeaderComponentComponent } from './header-component/header-component.component';
import { MainScreenComponentComponent } from './HomePageComponents/screen1/main-screen-component.component';
import { Screen2Component } from './HomePageComponents/screen2/screen2.component';
import { Screen2PanelComponent } from './HomePageComponents/screen2-panel/screen2-panel.component';
import { FooterComponentComponent } from './footer-component/footer-component.component';

import { LoginComponent } from './login/login.component';
import { HomeScreenComponent } from './HomePageComponents/home-screen/home-screen.component';
import { SignupComponent } from './signup/signup.component';
import {Helper} from './helper.service';

import { SidebarComponent } from './sidebar/sidebar.component';
// import {FileSelectDirective} from "ng2-file-upload";

import {AdminComponent} from "./admin/admin.component";
import {ImageSidePanel} from "./image-side-panel/sidebar1.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {Global} from "./Global.service";
import { IconGridComponent } from './icon-grid/icon-grid.component';
import {Shared} from "./shared.service";
import { AllIconComponent } from './all-icon/all-icon.component';
import {RlTagInputModule} from "angular2-tag-input/dist";
import {TagsInputDirective} from './tagsinput/tagsinput.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { BlogPageComponent } from './blog-page/blog-edit.component';
import { ResultItemComponent } from './result-item/result-item.component';
import { BlogGridComponent } from './blog-grid/blog-grid.component';
import { BlogDisplayComponent } from './blog-display/blog-display.component';
import { TextEditorInterfaceComponent } from './text-editor-interface/text-editor-interface.component';
import { SortArrayByPipe } from './sort-array-by.pipe';
import { ImageModalComponent } from './image-modal/image-modal.component';
import { ImageGridComponent } from './image-grid/image-grid.component';
import { ThreadComponent } from './thread/thread.component';
import { CommentComponent } from './comment/comment.component';
import { TrimStringPipe } from './trim-string.pipe';
import {EventService} from "./event.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ComponentService} from "./component.service";
import {AuthService} from "./auth.service";

// routes
const appRoutes: Routes = [
  {component: LoginComponent, path: 'login'},
  {component: LoginComponent, path: 'login/:nextURL'},
  {component: SidebarComponent, path: 'sidebar'},
  {component: SignupComponent, path: 'signup'},
  {component: SignupComponent, path: 'signup/:nextURL'},
  {component: IconGridComponent, path: 'icons'},
  {component: BlogGridComponent, path: 'results'},
  {component: HomeScreenComponent, path: 'home'},
  {component: AdminComponent, path: 'admin'},
  {component: DashboardComponent, path: 'dashboard', children: [
    {component: BlogGridComponent, path: 'Drafts'},
    {component: BlogGridComponent, path: 'likedBlogs'},
    {component: BlogGridComponent, path: 'writtenBlogs'},
    {component: BlogGridComponent, path: 'upload'}
    ]},
  {component: BlogGridComponent, path: 'allresults'},
  {component: BlogDisplayComponent, path: 'blogdisplay/:id'},
  {component: TextEditorInterfaceComponent, path: 'new/blog',canActivate:[AuthService]},
  {component: TextEditorInterfaceComponent, path: 'blogEdit'},
  {component: TextEditorInterfaceComponent, path: 'blogEdit/:id'},
  // {component: BlogGridComponent, path: ''},
  { path: '', redirectTo: 'allresults',pathMatch: 'full'},
  { path: '404', component: NotFoundComponent }
  // { path: '**', redirectTo: '404' }
];


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponentComponent,
    MainScreenComponentComponent,
    Screen2Component,
    Screen2PanelComponent,
    FooterComponentComponent,
    LoginComponent,
    HomeScreenComponent,
    SignupComponent,

    SidebarComponent,

    // FileSelectDirective,

    AdminComponent,
    ImageSidePanel,
    DashboardComponent,
    IconGridComponent,
    AllIconComponent,
    TagsInputDirective,
    NotFoundComponent,
    BlogPageComponent,
    ResultItemComponent,
    BlogGridComponent,
    BlogDisplayComponent,
    TextEditorInterfaceComponent,
    SortArrayByPipe,
    ImageModalComponent,
    ImageGridComponent,
    ThreadComponent,
    CommentComponent,
    TrimStringPipe


  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes ),
    BrowserAnimationsModule
  ],
  providers: [
   Helper,Global,Shared,EventService,ComponentService,AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
