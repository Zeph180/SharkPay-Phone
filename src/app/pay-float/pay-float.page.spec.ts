import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PayFloatPage } from './pay-float.page';

describe('PayFloatPage', () => {
  let component: PayFloatPage;
  let fixture: ComponentFixture<PayFloatPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PayFloatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
