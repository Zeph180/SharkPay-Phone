import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PayAirtimePage } from './pay-airtime.page';

describe('PayAirtimePage', () => {
  let component: PayAirtimePage;
  let fixture: ComponentFixture<PayAirtimePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PayAirtimePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
