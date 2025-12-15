import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  public formError: string = '';
  submitted = false;
  credentials = {
    name: '',
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
  }

  public onLoginSubmit(): void {
    this.formError = '';
    if (!this.credentials.email || !this.credentials.password) {
      this.formError = 'Email and password are required';
      return;
    }
    this.doLogin();
  }

  private doLogin(): void {
    this.submitted = true;
    this.authenticationService.login(this.credentials.email, this.credentials.password)
      .subscribe({
        next: () => {
          this.router.navigate(['']);
        },
        error: (error: any) => {
          this.formError = 'Invalid email or password';
          this.submitted = false;
          console.error('Login error:', error);
        }
      });
  }
}