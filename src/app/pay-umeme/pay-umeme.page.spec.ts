import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PayUMEMEPage } from './pay-umeme.page';

describe('PayUMEMEPage', () => {
  let component: PayUMEMEPage;
  let fixture: ComponentFixture<PayUMEMEPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PayUMEMEPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
