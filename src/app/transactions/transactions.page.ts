import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit {
  public transactions = [
    {
      "tranType": "URA",
      amount: '20000',
      date: '5 Dec 2024',
      status: 'success',
      id: "112212121"
    },
    {
      "tranType": "URA",
      amount: '20000',
      date: '5 Dec 2024',
      status: 'failed',
      id: "112212121"
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
