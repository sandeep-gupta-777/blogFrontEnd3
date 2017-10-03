import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Observable";

@Injectable()
export class AuthService implements CanActivate{
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean| Observable<boolean>| Promise<boolean> {

     let isLoggedInBoolean:boolean = localStorage.getItem('token')!== null;
     if(isLoggedInBoolean){
       return true;
     }
     else {
       setTimeout(()=>{this.router.navigate(['login'])},0)
       return false;
     }
  }

  constructor(private router:Router) { }

}
