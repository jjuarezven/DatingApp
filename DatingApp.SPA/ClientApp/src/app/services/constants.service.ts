import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  readonly baseUrl: string = 'https://localhost:44397/api/values/';
  readonly authUrl: string = 'https://localhost:44397/api/auth/';

constructor() { }

}
