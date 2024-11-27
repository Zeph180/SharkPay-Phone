import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage implements OnInit {
  paymentTypes = [
    { title: 'Pay NWSC', icon: 'water', page: '/pay-nwsc' },
    { title: 'Pay URA', icon: 'receipt', page: '/pay-ura' },
    { title: 'Electricity', icon: 'flash', page: '/pay-umeme' },
    { title: 'Airtime', icon: 'wifi', page: '/pay-airtime' },
    { title: 'Redeem Commission', icon: 'tv', page: '/redeem-float' },
    { title: 'Transfer Float', icon: 'school', page: '/transfer-float' },
  ];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigateToPayment(page: string) {
    this.router.navigate([page]);
  }

}
