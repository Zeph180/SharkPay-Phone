import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PayTvPage } from './pay-tv.page';

describe('PayTvPage', () => {
  let component: PayTvPage;
  let fixture: ComponentFixture<PayTvPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PayTvPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
