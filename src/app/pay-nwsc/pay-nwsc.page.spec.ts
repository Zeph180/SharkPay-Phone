import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PayNWSCPage } from './pay-nwsc.page';

describe('PayNWSCPage', () => {
  let component: PayNWSCPage;
  let fixture: ComponentFixture<PayNWSCPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PayNWSCPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
