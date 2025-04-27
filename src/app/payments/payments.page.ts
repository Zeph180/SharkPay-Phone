import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage implements OnInit {
  paymentTypes = [
    { title: 'NWSC', icon: 'water', page: '/pay-nwsc' },
    { title: 'URA', icon: 'receipt', page: '/pay-ura' },
    { title: 'Redeem Commission', icon: 'tv', page: '/redeem-float' },
    { title: 'Transfer Float', icon: 'school', page: '/transfer-float' },
    { title: 'Electricity', icon: 'flash', page: '/pay-umeme' },
    { title: 'Airtime', icon: 'wifi', page: '/pay-airtime' },
    { title: 'Data', icon: 'wifi', page: '/pay-data' },
    { title: 'Momo Topup', icon: 'wifi', page: '/momo' }

  ];

  constructor(private router: Router) { }

  ngOnInit() {
    console.log("ddd")
  }

  navigateToPayment(page: string) {
    this.router.navigate([page]);
  }

}
