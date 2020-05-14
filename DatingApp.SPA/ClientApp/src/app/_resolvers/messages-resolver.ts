/*
Just like every important thing in angular, resolver is also a class. In fact, Resolver is a service
which has to be [provided] in root module.

To understand the use of resolvers, Lets see how the flow happens, when someone clicks the link.
General Routing Flow.
  1.User clicks the link.
  2.Angular loads the respective component.

Routing Flow with Resolver
  1.User clicks the link.
  2.Angular executes certain code and returns a value or observable.
  3.You can collect the returned value or observable in constructor or in ngOnInit, in class of your component which is about to load.
  4.Use the collected the data for your purpose.
  5.Now you can load your component.
Steps 2,3 and 4 are done with a code called Resolver.
So basically resolver is that intermediate code, which can be executed when a link has been clicked and before a component is loaded.
*/

import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/User';
import { UserService } from '../services/user.service';
import { AlertifyService } from '../services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from '../_models/message';
import { AuthService } from '../services/auth.service';

@Injectable()
export class MessagesResolver implements Resolve<Message[]> {
  pageNumber = 1;
  pageSize = 5;
  messageContainer = 'Unread';

  constructor(
    private userService: UserService,
    private router: Router,
    private alertify: AlertifyService,
    private authService: AuthService 
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
    return this.userService.getMessages(this.authService.decodedToken.nameid, this.pageNumber, this.pageSize, this.messageContainer).pipe(
      catchError(error => {
        this.alertify.error('problem retrieving messages');
        this.router.navigate(['/home']);
        return of(null);
      })
    );
  }
}
