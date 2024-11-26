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
    { title: 'Pay TV', icon: 'tv', page: '/pay-tv' },
    { title: 'School Fees', icon: 'school', page: '/pay-school' },
  ];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigateToPayment(page: string) {
    this.router.navigate([page]);
  }

}
