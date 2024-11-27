import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-paassword',
  templateUrl: './reset-paassword.page.html',
  styleUrls: ['./reset-paassword.page.scss'],
})
export class ResetPaasswordPage implements OnInit {
  resetPasswordForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,

  ) {
    this.resetPasswordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]]
    });
  }

  ngOnInit() {
  }

  resetPassword() {

  }
}
