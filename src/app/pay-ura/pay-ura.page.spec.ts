import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PayUraPage } from './pay-ura.page';

describe('PayUraPage', () => {
  let component: PayUraPage;
  let fixture: ComponentFixture<PayUraPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PayUraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
