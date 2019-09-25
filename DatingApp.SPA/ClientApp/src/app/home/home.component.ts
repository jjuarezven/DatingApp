import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantsService } from '../services/constants.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode = false;
  values: any;

  constructor(private http: HttpClient, private CONSTANTS: ConstantsService) { }

  ngOnInit() {
    this.getValues();
  }

  registerToggle() {
    this.registerMode = !this.registerMode;
  }

  getValues() {
    this.http.get(this.CONSTANTS.baseUrl).subscribe(response => {
      this.values = response;
    }, error => {
        console.log(error);
    });
  }

}
