import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root',
})

export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const isAuthenticated = this.authService.getToken() !== null;
    // const isTokenExpired = this.authService.isTokenExpired(
    //   this.authService.getToken() || ''
    // );

    // If the token is expired, log out the user
    // if (isTokenExpired) {
    //   this.authService.logout();
    //   return this.router.createUrlTree(['/login']);
    // }

    const allowAuthOnly = route.data['authOnly'] ?? false;
    const allowGuestOnly = route.data['guestOnly'] ?? false;

    // Authenticated routes (e.g., /dashboard)
    if (allowAuthOnly && !isAuthenticated) {
      return this.router.createUrlTree(['/login']);
    }

    // Guest-only routes (e.g., /login, /register)
    if (allowGuestOnly && isAuthenticated) {
      return this.router.createUrlTree(['/dashboard']);
    }

    return true;
  }
}