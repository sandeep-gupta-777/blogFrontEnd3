import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import { Response } from '@angular/http';

import {Helper} from "../../helper.service";
import {Global} from "../../Global.service";
import {SiteUser} from "../../models";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  showErrorMessage = false;
  helper_message = "";

  constructor(private helper:Helper,public global:Global, private router:Router,private activatedRoute:ActivatedRoute) {
  }
  @ViewChild('f') form;
  onSubmit() {
      console.log(this.form);
    const user = {email:this.form.value.username,password:this.form.value.password};
    this.helper.login(user).subscribe(

        (data:{massage:string,token:string,user:SiteUser}) =>{
          console.log('saved in local stogare',data);
          localStorage.setItem('token',data.token);
          localStorage.setItem('userID',data.user._id);
          // this.router.navigateByUrl(this.global.previousSRPURL);
          this.router.navigate([this.global.previousSRPURL],{queryParams:this.global.previousSRPQueryParams});
          this.global.setLoggedInUserDetails(data.user);
          this.helper.showNotificationBarEvent.emit({message:'You are logged in!'});

        },
        error => {

          this.helper_message = error.problem_message;
          this.showErrorMessage = true;
          setTimeout( () => {
            this.showErrorMessage = false;
          },5000);
          console.log(error);
        }
    );
  }

  makeGetRequestForFaceBook(){
      this.helper.makeGetRequestForFaceBook('/auth/facebook');
  }

  ngOnInit() {
    this.global.showSearchBarBoolean = false;
    if( localStorage.getItem('token')!== null){
      setTimeout(()=>{` `
        this.router.navigate([this.global.previousSRPURL],{queryParams:this.global.previousSRPQueryParams});

      },500);

    }

  }

}
