import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'mail' },
    { title: 'Contact us', url: '/contact-us', icon: 'paper-plane' },
    { title: 'Account', url: '/my-account', icon: 'heart' },
    { title: 'Payments', url: '/payments', icon: 'archive' },
    { title: 'Print', url: '/print', icon: 'warning' },
    { title: 'Transactions', url: '/transactions', icon: 'trash' },
    { title: 'App Updates', url: '/', icon: 'warning' },
    { title: 'Logout', url: '/', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  showMenu = true; // Flag to control menu visibility

  constructor(private router: Router) {
    // Subscribe to route changes
    this.router.events.subscribe(() => {
      // Hide the menu on the login page
      this.showMenu = !this.router.url.includes('/login');
      console.log(this.showMenu)
    });
  }
}
