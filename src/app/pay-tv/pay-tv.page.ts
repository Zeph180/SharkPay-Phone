import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pay-tv',
  templateUrl: './pay-tv.page.html',
  styleUrls: ['./pay-tv.page.scss'],
})
export class PayTvPage implements OnInit {
  payTvForm: FormGroup;
  isSubmitted = false;

  // List of TV Companies and their Bouquets
  tvCompanies = [
    { name: 'DSTV', bouquets: ['Compact', 'Family', 'Premium'] },
    { name: 'GOTV', bouquets: ['Lite', 'Max', 'Supersport'] },
    { name: 'StarTimes', bouquets: ['Nova', 'Classic', 'Super'] },
  ];

  availableBouquets: string[] = []; // Bouquets based on selected TV Company

  constructor(private formBuilder: FormBuilder) {
    this.payTvForm = this.formBuilder.group({
      meterNumber: ['', [Validators.required]],
      tvCompany: ['', [Validators.required]],
      bouquet: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(1)]],
      password: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
    });
  }

  ngOnInit() {
  }

  // Helper to check for errors
  hasError(controlName: string, errorName: string): boolean {
    return this.payTvForm.controls[controlName].hasError(errorName);
  }

  // On TV Company selection, update available bouquets
  onTvCompanyChange(event: any) {
    const selectedCompany = event.detail.value;
    const company = this.tvCompanies.find(c => c.name === selectedCompany.name);
    this.availableBouquets = company ? company.bouquets : [];
    this.payTvForm.controls['bouquet'].reset(); // Reset bouquet field
  }

  // Submit form
  submit() {
    this.isSubmitted = true;
    if (this.payTvForm.valid) {
      const formData = this.payTvForm.value;
      console.log('Payment Data:', formData);

      // Handle payment logic here
      alert('Payment Successful!');
    } else {
      console.log('Form is invalid');
    }
  }
}
