import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pay-data',
  templateUrl: './pay-data.page.html',
  styleUrls: ['./pay-data.page.scss'],
})
export class PayDataPage implements OnInit {
  dataForm: FormGroup;
  isSubmitted = false;

  constructor(private formBuilder: FormBuilder) {
    this.dataForm = this.formBuilder.group({
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      amount: ['', [Validators.required, Validators.min(1)]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
  }

  // Helper to check for errors
  hasError(controlName: string, errorName: string): boolean {
    return this.dataForm.controls[controlName].hasError(errorName);
  }

  submit() {
    this.isSubmitted = true;
    if (this.dataForm.valid) {
      const formData = this.dataForm.value;
      console.log('Payment Data:', formData);

      // Handle payment submission logic here
      alert('Payment Successful!');
    } else {
      console.log('Form is invalid');
    }
  }
}
