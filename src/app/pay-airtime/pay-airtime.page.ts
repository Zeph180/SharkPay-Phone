import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pay-airtime',
  templateUrl: './pay-airtime.page.html',
  styleUrls: ['./pay-airtime.page.scss'],
})
export class PayAirtimePage implements OnInit {
  airtimeForm: FormGroup;
  isSubmitted = false;

  constructor(private formBuilder: FormBuilder) {
    this.airtimeForm = this.formBuilder.group({
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      amount: ['', [Validators.required, Validators.min(1)]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {

  }

  // Helper to check for errors
  hasError(controlName: string, errorName: string): boolean {
    return this.airtimeForm.controls[controlName].hasError(errorName);
  }

  submit() {
    this.isSubmitted = true;
    if (this.airtimeForm.valid) {
      const formData = this.airtimeForm.value;
      console.log('Payment Data:', formData);

      // Handle payment submission logic here
      alert('Payment Successful!');
    } else {
      console.log('Form is invalid');
    }
  }
}
