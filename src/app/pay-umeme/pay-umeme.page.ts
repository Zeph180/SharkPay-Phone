import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pay-umeme',
  templateUrl: './pay-umeme.page.html',
  styleUrls: ['./pay-umeme.page.scss'],
})
export class PayUMEMEPage implements OnInit {
  FormData!: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.FormData = this.fb.group({
      tin: ['', [Validators.required, Validators.minLength(10)]],
      reference: ['', Validators.required],
      amount: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      payerName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submit() {
    if (this.FormData.valid) {
      console.log('URA Payment Data:', this.FormData.value);
      // Add logic for payment processing (e.g., send data to the backend)
    } else {
      console.log('Form is invalid');
    }
  }
}
