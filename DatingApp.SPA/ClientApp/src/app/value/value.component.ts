import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantsService } from '../services/constants.service';

@Component({
  selector: 'app-value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.css']
})
export class ValueComponent implements OnInit {
  values: any;

  constructor(private http: HttpClient, private CONSTANTS: ConstantsService) { }

  ngOnInit() {
    this.getValues();
  }

  getValues() {
    this.http.get(this.CONSTANTS.baseUrl).subscribe(response => {
      this.values = response;
    }, error => {
        console.log(error);
    });
  }
}
