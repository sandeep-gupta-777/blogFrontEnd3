import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RouterModule, Routes} from "@angular/router";
import { AppComponent } from './app.component';
import {Global} from "./Global.service";
import {Helper} from './helper.service';
import {Shared} from "./shared.service";
import { HeaderComponentComponent } from './header-component/header-component.component';
import { FooterComponentComponent } from './footer-component/footer-component.component';
import { NotFoundComponent } from './not-found/not-found.component';
import {EventService} from "./event.service";
import {ComponentService} from "./component.service";
import {AuthService} from "./auth.service";
import {BlogGridComponent} from "./blog-grid/blog-grid.component";
import {SharedModule} from "./sharedModule";
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { TabsComponent } from './tabs/tabs.component';
import { CamelcasePipe } from './camelcase.pipe';

// routes
const appRoutes: Routes = [
  {component: BlogGridComponent, path: 'results'},
  {component: BlogGridComponent, path: 'allresults'},
  {loadChildren: './non-root/nonRootModule#NonRootModule', path: 'other'},
  { path: '', redirectTo: 'allresults',pathMatch: 'full'},
  { path: '**', component: NotFoundComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponentComponent,
    FooterComponentComponent,
    // BlogGridComponent,
    NotFoundComponent,
    ProgressBarComponent,
    TabsComponent,

    // LoginComponent,
    // SignupComponent,
    // DashboardComponent,
    // TagsInputDirective,
    // BlogPageComponent,
    // BlogDisplayComponent,
    // TextEditorInterfaceComponent,
    // SortArrayByPipe,
    // ThreadComponent,
    // CommentComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    SharedModule
    // NonRootModule
  ],
  providers: [
   Helper,Global,Shared,EventService,ComponentService,AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
