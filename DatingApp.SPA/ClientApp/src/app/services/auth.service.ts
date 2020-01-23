import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantsService } from './constants.service';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../_models/User';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // this is the way the author suggests to use JwtHelperService, but it can injected the normal way as well
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: User;

  constructor(private http: HttpClient, private CONSTANTS: ConstantsService) { }

  login(model: any) {
    return this.http.post(this.CONSTANTS.authUrl + 'login', model)
      .pipe(
        map((response: any) => {
          const user = response;
          if (user) {
            localStorage.setItem('token', user.token);
            localStorage.setItem('user', JSON.stringify(user.user));
            this.decodedToken = this.jwtHelper.decodeToken(user.token);
            this.currentUser = user.user;
            console.log(this.decodedToken);
          }
        }));
  }

  register(model: any) {
    return this.http.post(this.CONSTANTS.authUrl + 'register', model);
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }
}
