import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/_models/message';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { AlertifyService } from 'src/app/services/alertify.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[];
  newMessage: any = {};
  currentUserId = 0;

  constructor(private userService: UserService, private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.currentUserId = +this.authService.decodedToken.nameid;
    this.userService.getMessageThread(this.currentUserId, this.recipientId).pipe(tap(messages => {
      for (let index = 0; index < messages.length; index++) {
        if (!messages[index].isRead && messages[index].recipientId === this.currentUserId) {
          this.userService.markAsRead(this.currentUserId, messages[index].id);
        }
      }
    }))
    .subscribe(messages =>
      this.messages = messages,
      error => this.alertify.error(error));
  }

  sendMessage() {
    this.newMessage.recipientId = this.recipientId;
    this.userService.sendMessage(this.currentUserId, this.newMessage).subscribe((message: Message) => {
      this.messages.unshift(message);
      this.newMessage.content = '';
    }, error => this.alertify.error(error));
  }
}
