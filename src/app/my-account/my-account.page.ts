import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage implements OnInit {
  agentDetails = {
    name: 'John Doe',
    agentNumber: 'AGT123456',
    accountBalance: 1310920, // Example balance
    commission: 99272,
  };

  constructor() { }

  ngOnInit() {
  }

  logout() {
    alert('Logged out successfully!');
    // Add actual logout logic here
  }
}
