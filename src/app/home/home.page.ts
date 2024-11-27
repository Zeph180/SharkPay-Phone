import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalMethodsService } from '../helpers/global-methods.service';
import Swiper from 'swiper';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public popularServices = [
    {
      title: 'URA',
      icon: 'phone-portrait-outline',
      color: 'primary',
      route: "/pay-ura"
    },
    {
      title: 'UMEME',
      icon: 'flash-outline',
      color: 'secondary',
      route: "/pay-umeme"
    },
    {
      title: 'TV',
      icon: 'tv-outline',
      color: 'tertiary',
      route: "/airtime"
    },
  ]

  public commissions = [
    {
      amount: '20000',
      date: '5 Dec 2024'
    },
    {
      amount: '20000',
      date: '5 Dec 2024'
    },
    {
      amount: '20000',
      date: '5 Dec 2024'
    },
    {
      amount: '20000',
      date: '5 Dec 2024'
    }
  ]

  public accounts: {
    accountNumber: string
    balance: string,
    accountName: string,
    accountTypeId: string,
    accountType: string
  }[] = []

  public swiper!: Swiper

  constructor(
    public router: Router,
    private globalMethods: GlobalMethodsService,
  ) {
    this.accounts = this.globalMethods.getUserData<{
      accountNumber: string;
      balance: string;
      accountName: string;
      accountTypeId: string;
      accountType: string;
    }[]>('accounts') || [];
  }

  ngOnInit() {
    console.log("acc:  ", this.accounts)
  }

  navigateTo(service: any) {
    if (service.route) {
      this.router.navigate([service.route]);
    } else {
      console.log('Route not defined for this service');
    }
  }

}
