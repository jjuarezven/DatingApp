import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantsService } from './constants.service';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../_models/User';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // this is the way the author suggests to use JwtHelperService, but it can injected the normal way as well
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: User;
  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currenPhotoUrl = this.photoUrl.asObservable();

  constructor(private http: HttpClient, private CONSTANTS: ConstantsService) {}

  login(model: any) {
    return this.http.post(this.CONSTANTS.authUrl + 'login', model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          localStorage.setItem('token', user.token);
          localStorage.setItem('user', JSON.stringify(user.user));
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
          this.currentUser = user.user;
          console.log(this.decodedToken);
          this.changeMemberPhoto(this.currentUser.photoUrl);
        }
      })
    );
  }

  changeMemberPhoto(photoUrl: string) {
    // updates photoUrl
    this.photoUrl.next(photoUrl);
  }

  register(user: User) {
    return this.http.post(this.CONSTANTS.authUrl + 'register', user);
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  roleMatch(allowedRoles): boolean {
    let isMatch = false;
    const userRoles = this.decodedToken.role as Array<string>;
    allowedRoles.forEach(element => {
      if (userRoles.includes(element)) {
        isMatch = true;
        return;
      }
    });
    return isMatch;
  }
}

/*
When to subscribe/ when to call authService's method?
  Could you please explain why do we  call authService.changeMemberPhoto() in app.component and in setMainPhoto (photo-editor)
  while in member-edit.component and nav.component, we subscribed to the behaviour subject?

  The reason they are different is because they serve different purposes.
Understand that the BehaviourSubject is both an Observer and an Observable at the same time. Meaning that the BehaviourSubject
sends notifications to anyone who has subscribed to it, but can also be updated by calling its next method.

  The NavBar component and The MemberEdit components are "passive" they just need to receive notification from the BehaviourSubject
that the Main image has changed so they can display the correct image in their components.

  On the other hand the photoEditor and the App component are responsible for updating the main image they are "active".
  The photoEditor changes the main image so needs to call the next method on the BehaviourSubject which in turn informs
  anyone who has subscribed to it. The App component likewise needs to call the next  method  since if the user refreshed
  the browser all user and photo information is lost and needs to be accessed again from the local cache which holds the latest
  main photo image.
*/
