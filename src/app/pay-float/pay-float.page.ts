import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pay-float',
  templateUrl: './pay-float.page.html',
  styleUrls: ['./pay-float.page.scss'],
})
export class PayFloatPage implements OnInit {
  formData: FormGroup;

  constructor(private fb: FormBuilder) {
    // Initialize the form with required fields
    this.formData = this.fb.group({
      accountNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10,12}$')]],
      amount: ['', [Validators.required, Validators.min(1)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
  }

  submit() {
    if (this.formData.valid) {
      console.log('Form submitted:', this.formData.value);
      alert('Float payment initiated!');
      // Add API call or further processing logic here
    }
  }
}
