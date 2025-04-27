import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RedeemFloatPage } from './redeem-float.page';

describe('RedeemFloatPage', () => {
  let component: RedeemFloatPage;
  let fixture: ComponentFixture<RedeemFloatPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RedeemFloatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
