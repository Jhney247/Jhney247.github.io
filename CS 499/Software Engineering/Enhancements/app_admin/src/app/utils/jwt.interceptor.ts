import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

/**
 * JWT Interceptor - Functional style for Angular 17+
 * Adds Authorization header with JWT token to outgoing requests
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthenticationService);
  
  // Don't add token to auth endpoints
  const isAuthAPI = req.url.includes('login') || req.url.includes('register');
  
  // If logged in and not an auth endpoint, clone request and add Authorization header
  if (authService.isLoggedIn() && !isAuthAPI) {
    const token = authService.getToken();
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }
  
  return next(req);
};