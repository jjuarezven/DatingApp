import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { User } from 'src/app/_models/User';

@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.css']
})
export class RolesModalComponent implements OnInit {
  user: User;
  roles: any[];
  @Output() updateSelectedRoles = new EventEmitter();
  
  constructor(public bsModalRef: BsModalRef) {}
  ngOnInit() {
  }

  updateRoles() {
    this.updateSelectedRoles.emit(this.roles);
    this.bsModalRef.hide();
  }

}
