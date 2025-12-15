import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripDataService } from './trip-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  authResp: AuthResponse = new AuthResponse();

  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private tripDataService: TripDataService
  ) { }

  // Get our token from our Storage provider
  public getToken(): string {
    let out: any;
    out = this.storage.getItem('travlr-token');
    if(!out) {
      return '';
    }
    return out;
  }

  // Save our token to our Storage provider
  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }

  // Logout of our application and remove the JWT from Storage
  public logout(): void {
    this.storage.removeItem('travlr-token');
  }

  // Boolean to determine if we are logged in
  public isLoggedIn(): boolean {
    const token: string = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > (Date.now() / 1000);
    } else {
      return false;
    }
  }

  // Retrieve the current user
  public getCurrentUser(): User {
    const token: string = this.getToken();
    if (!token) {
      return { email: '', name: '' } as User;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { 
      email: payload.email, 
      name: payload.name,
      role: payload.role 
    } as User;
  }

  // Login method
  public login(email: string, passwd: string): any {
    return new Observable((observer) => {
      this.tripDataService.login(email, passwd)
        .subscribe({
          next: (value: any) => {
            if(value && value.token) {
              console.log('Login successful:', value);
              this.authResp = value;
              this.saveToken(value.token);
              observer.next(value);
              observer.complete();
            } else {
              observer.error('Invalid response from server');
            }
          },
          error: (error: any) => {
            console.log('Login error:', error);
            observer.error(error);
          }
        });
    });
  }

  // Register method
  public register(user: User, passwd: string): void {
    this.tripDataService.register(user, passwd)
      .subscribe({
        next: (value: any) => {
          if(value) {
            console.log(value);
            this.authResp = value;
            this.saveToken(this.authResp.token);
          }
        },
        error: (error: any) => {
          console.log('Error: ' + error);
        }
      });
  }
}