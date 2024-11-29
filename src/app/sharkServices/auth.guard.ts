import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { GlobalMethodsService } from '../helpers/global-methods.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private globalMethods: GlobalMethodsService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const token = localStorage.getItem('accessToken');

        if (this.isTokenValid(token)) {
            return true;
        } else {
            this.globalMethods.logout(this.router);
            return false;
        }
    }

    private isTokenValid(token: string | null): boolean {
        if (!token) return false;

        try {
            //JWT token expiration check
            const tokenPayload = this.decodeToken(token);
            const currentTime = Math.floor(Date.now() / 1000);
            return tokenPayload && tokenPayload.exp > currentTime;
        } catch (error) {
            console.error('Token validation error:', error);
            return false;
        }
    }

    private decodeToken(token: string): any {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch {
            return null;
        }
    }
}
