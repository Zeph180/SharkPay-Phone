import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  order = {
    id: '12345',
    date: new Date(),
    items: [
      { name: 'Product 1', quantity: 2, price: 10.99 },
      { name: 'Product 2', quantity: 1, price: 5.99 }
    ],
    subtotal: 27.97,
    tax: 2.80,
    total: 30.77
  };

  printContent = 'Test print content\nSecond line\n\nFooter text';
}
