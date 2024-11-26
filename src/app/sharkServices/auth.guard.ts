// import { Injectable } from '@angular/core';
// import { CanActivate } from '@angular/router';
// import { Router } from '@angular/router';

// @Injectable({
//   providedIn: 'root'
// })

// export class AuthGuard implements CanActivate {

//   constructor(private router: Router) { }

//   canActivate(): boolean {
//     const token = localStorage.getItem('userToken');
//     if (token) {
//       return true; // If there's a token, allow access
//     } else {
//       this.router.navigate(['/login']);
//       return false; // If no token, redirect to login page
//     }
//   }
// }
