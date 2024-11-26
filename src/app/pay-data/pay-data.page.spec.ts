import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PayDataPage } from './pay-data.page';

describe('PayDataPage', () => {
  let component: PayDataPage;
  let fixture: ComponentFixture<PayDataPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PayDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
