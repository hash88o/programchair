import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private httpClient: HttpClient) {}
  getCurrentUserProfile() {
    return this.httpClient.get('/apix/profile/me');
  }
}
